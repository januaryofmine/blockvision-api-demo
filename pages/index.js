import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { toastError } from '@/helpers/notification.helper';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { accountCollectionApi } from '../api/account.api';
import styles from '../styles/styles.module.scss';

export default function Home() {
  const [accountInput, setAccountInput] = useState('');
  const [accountParam, setAccountParam] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const convertData = (dataRes = []) => {
    const newData = dataRes.map((item) => {
      if (item?.imageURL?.slice(0, 5) === 'ipfs:') {
        return {
          ...item,
          imageURL: `${process.env.NEXT_PUBLIC_URL_IPFS}${item?.imageURL?.slice(
            6
          )}`,
        };
      }

      return item;
    });

    return newData;
  };

  const handleSubmit = async (e) => {
    try {
      if (accountInput?.trim()?.length > 0) {
        const res = await accountCollectionApi.getAccountCollection({
          owner: accountInput?.trim(),
          pageIndex,
          pageSize,
        });

        if (!res?.result) {
          setAccountParam('');
          setPage(1);
          setTotal(0);
          setData([]);
          toastError('Not found');
          return;
        }
        setAccountParam(accountInput?.trim());
        const listItem = convertData(res?.result?.data);
        setTotal(res?.result?.total);
        setData(listItem);
      }
    } catch (error) {
      toastError('Error');
    }
  };

  const handleChangePage = async (newPage) => {
    try {
      if (accountParam?.length > 0) {
        const res = await accountCollectionApi.getAccountCollection({
          owner: accountParam,
          pageIndex: newPage,
          pageSize,
        });
        if (!res?.result) {
          toastError('Not found');
          return;
        }
        setPage(newPage);

        const listItem = convertData(res?.result?.data);

        setTotal(res?.result?.total);
        setData(listItem);
      }
    } catch (error) {
      toastError('Error');
    }
  };

  const setImgErr = (index) => {
    const newData = [...data];
    newData[index] = { ...newData[index], imageURL: '/no-image.png' };
    setData([...newData]);
  };

  return (
    <div>
      <Head>
        <title>SUI Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.wrapInput}>
              <input
                placeholder="Account"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
              />
              <button
                className={styles.btnX}
                onClick={() => {
                  setAccountInput('');
                  setAccountParam('');
                  setPage(1);
                  setTotal(0);
                  setData([]);
                }}
              >
                <Image src={'/x-symbol.svg'} width={15} height={15} alt="" />
              </button>
            </div>

            <button className={styles.btnSend} onClick={handleSubmit}>
              Send
            </button>
          </div>
          <div className={styles.wrapList}>
            {data?.map((item, index) => (
              <div key={index} className={styles.wrapItem}>
                <Image
                  src={item.imageURL}
                  width={400}
                  height={400}
                  loader={({ src }) => src}
                  alt={item.name}
                  // onError={() => {
                  //   setImgErr(index);
                  // }}
                />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
          <div className={styles.wrapPagination}>
            <PaginationControl
              page={page}
              between={4}
              total={total}
              limit={pageSize}
              changePage={(_page) => {
                handleChangePage(_page);
              }}
              ellipsis={1}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
