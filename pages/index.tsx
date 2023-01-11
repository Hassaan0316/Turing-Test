import { useMemo, useState } from 'react';
import Head from 'next/head'
// import Select from 'react-select'
import { useQuery } from '@apollo/client';
import { TablePaginationConfig } from 'antd';
import Header from '@container/Header/Header'
import { callQueries } from 'lib/apollo/query/callQuery';
import { INodeData, IPaginationParams, NodesType, TSelectFilter } from 'types/dataTypes';
import TableContent from '@container/Table/TableContent';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import styles from '@styles/Home.module.scss';
import dynamic from 'next/dynamic';
const Select = dynamic(
  () => import('react-select').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
);
const options = [
  { value: 'all', label: 'All' },
  { value: 'missed', label: 'Missed' },
  { value: 'archived', label: 'Archived' },
  { value: 'unArchieve', label: 'Unarchieve' }
]

export default function Home() {
  const [offset, setOffset] = useState(0);
  const [filteredValue, setFileteredValue] = useState({ value: 'all', label: 'All' },)
  const [total, setTotal] = useState(10);
  const [tableParams, setTableParams] = useState<IPaginationParams>({
    pagination: {
      position: ['bottomCenter'],
      current: 1,
      pageSize: 10,
      showSizeChanger: false,
    },
  });
  const { data, error, loading: isLoading } = useQuery<INodeData>(callQueries.Call, {
    variables: {
      offset: offset,
      limit: tableParams.pagination?.pageSize
    },
  });

  const handleRefetchNextPage = (
    pagination: TablePaginationConfig, filters: Record<string, FilterValue>, sorter: SorterResult<INodeData>,
  ) => {
    // @ts-ignore
    const toSkip = (pagination?.current * pagination.pageSize) - pagination?.pageSize;
    setTableParams({ pagination, filters, ...sorter });
    setOffset(toSkip);
  };

  const handleChangeFilter = (e: TSelectFilter) => {
    setFileteredValue({ value: e.value, label: e.label })
  }

  const handleFilters = (receivedData: NodesType[]) => {
    if (filteredValue.value === 'archived') {
      return receivedData.filter((item) => item.is_archived === true)
    } else if (filteredValue.value === 'unArchieve') {
      console.log(receivedData)
      return receivedData.filter((item) => item.is_archived === false)
    } else {
      return receivedData.filter((item) => item.call_type === 'missed')
    }
  }

  const tableData = useMemo(() => {
    let receivedData: NodesType[] = [];
    if (data) {
      const totalCount: number = data?.paginatedCalls.totalCount;
      setTotal(totalCount);
      setTableParams({ ...tableParams, pagination: { ...tableParams.pagination, total: totalCount ?? 0 } });
      receivedData = data.paginatedCalls.nodes.map((item: NodesType) => {
        return { ...item, key: item.id }
      });
      if (filteredValue.value !== 'all') receivedData = handleFilters(receivedData) 
    }
    return receivedData;
  }, [data, filteredValue])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.homeWrapper}>
        {/* <h2>Turing Technologies Frontend Test</h2> */}
        <div className={styles.filterClass}>
          <p className={styles.filterLabel}>Filter by :</p>
          <div style={{ width: '200px' }}>
            <Select onChange={handleChangeFilter} value={filteredValue} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} options={options} />

          </div>
        </div>

        <TableContent
          // @ts-ignore
          handleRefetchNextPage={handleRefetchNextPage}
          isLoading={isLoading}
          tableParams={tableParams} tableData={tableData} />
      </div>
      <Header />
    </>
  )
}
