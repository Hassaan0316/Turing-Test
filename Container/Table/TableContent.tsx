import React, { Suspense, useRef, useState } from 'react';
import { Button, Col, Input, InputRef, Row, Space, Table, Typography } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { IPaginationParams, NodesType } from 'types/dataTypes';
import { columns } from 'data/tableData';
import { calculateMinutesSeconds, capitalizeFirst } from 'utils/helperFunctions';
import ReusableUpdateModal from '@components/Modal/ReusableUpdateModal';
import styles from '@styles/Home.module.scss';

interface IPropTypes {
  tableData: NodesType[]
  tableParams: IPaginationParams;
  isLoading: boolean;
  handleRefetchNextPage: () => void;
  // handleChangeSelectSortDirection: (e: React.ChangeEvent<HTMLInputElement>) => void,
  // handleChangeSelectSortKey: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const initialState = {
  _id: '',
  news: '',
  liveVideoLink: '',
  logoLink: '',
}

const TableContent = ({ tableData, tableParams,handleRefetchNextPage,isLoading }: IPropTypes) => {
  const [editingKey, setEditingKey] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<NodesType | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPop, setShowpop] = useState(false);
  const [openManyModal, setOpenManyModal] = useState(false);
  const searchInput = useRef<InputRef>(null);
  const [open, setOpen] = useState<boolean>(false);

  // & {key: React.Key}
  const edit = (record: NodesType) => {
    setEditingKey(record.id);
    setSelectedRecord(record);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async () => {
    // const body = { ...updatePortal };
    // await triggerUpdate(body).then((res: any) => {
    //   if (res?.error) [getAPIErrorMessage(res.error), dispatch(loadingUpdateAction(false))];
    //   else {
    //     const msg = res?.data?.msg || 'Portal Updated Successfully';
    //     alert(msg);
    //   }
    //   handleCloseModal();
    //   handleRefetch();
    // });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const handleSearch = (confirm: (param?: FilterConfirmProps) => void) => {
    confirm();
  };


  const handleOpenModal = async () => {
    setShowpop(true);
  };

  const handleModal = (value: boolean) => {
    setOpen(value);
  } 

  const getUpdateRender = (): ColumnType<NodesType> => ({
    render: (_: any, record: NodesType) => {
      return (
        <button onClick={() => [edit(record), handleModal(true)]} className={styles.actionButton}>
          Add Node
        </button>
      );
    },
  });

  const updateCallTypeContent = (): ColumnType<NodesType> => ({
    render: (_: any, record: NodesType) => {
      const type = record?.call_type
      return (
        <p style={{ color: type === 'answered' ? 'green' : type === "missed" ? 'red' : 'purple' }}>
          {capitalizeFirst(type)}
        </p>
      );
    },
  });

  const durationContent = (): ColumnType<NodesType> => ({
    render: (_: any, record: NodesType) => {
      const type = record?.duration
      const timeValue = calculateMinutesSeconds(type);
      return (
        <div className={styles.durationContent}>
          <p className={styles.durationContent__time}>
            {timeValue.minutes} minutes {timeValue.seconds} seconds
          </p>
          <p className={styles.durationContent__time__seconds}>
             ({type}) seconds
          </p>
        </div>
      );
    },
  });

  const columnsData: any = columns.map(item => {
    const title = item.dataIndex;
    if (item.key === 'action') {
      return {
        ...item,
        ...getUpdateRender(),
      };
    } else if (item.key === 'call_type') {
      return {
        ...item,
        ...updateCallTypeContent()
      }
    }
    else if (item.key === 'duration') {
      return {
        ...item,
        ...durationContent()
      }
    }
    else {
      const defaultReturnValue = {
        ...item,
      };
      return defaultReturnValue;
    }
  });

  return (
    <>
      <Table
        style={{zIndex: 0}}
        columns={columnsData}
        dataSource={tableData}
        size={'small'}
        rowClassName="editable-row"
        scroll={{ x: 1500 }}
        sticky={true}
        loading={loading || isLoading}
        bordered={false}
        onChange={handleRefetchNextPage}
        pagination={tableParams.pagination}
      // expandable={{
      //   columnWidth: 20,
      //   expandedRowRender: record => <div>{record.news}</div>,
      //   rowExpandable: record => record.news ? true : false,
      // }}
      />
      <ReusableUpdateModal
        content={editingKey}
        handleCloseModal={handleModal}
        save={() => save()}
        open={open}
        record={selectedRecord}
        loading={loading}
      >
        {/* <Box paddingTop={2}>
          <Box paddingY={1}>
            <ReusableTextField label='Live Video Link' name='liveVideoLink' type='url' value={updatePortal.liveVideoLink || ''} handleChange={handleUpdateValues} />
          </Box>
          <Box paddingY={1}>
            <ReusableTextField label='Logo Link' name='logoLink' type='url' value={updatePortal.logoLink || ''} handleChange={handleUpdateValues} />
          </Box>
          <Box paddingY={1}>
            <ReusableTextField label='News' name='news' rows={5} type='textArea' value={updatePortal.news || ''} handleChange={handleUpdateValues} />
          </Box>
        </Box> */}
      </ReusableUpdateModal>
    </>
  );
};

export default TableContent;
