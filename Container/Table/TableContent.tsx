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
import ViewModal from '@components/Modal/ViewModal';
import { useMutation } from '@apollo/client';
import { userMutations } from 'lib/apollo/mutations/userMutations';

interface IPropTypes {
  tableData: NodesType[]
  tableParams: IPaginationParams;
  isLoading: boolean;
  handleRefetch: () => void;
  handleRefetchNextPage: () => void;
}

const TableContent = ({ tableData, tableParams, handleRefetchNextPage, isLoading, handleRefetch }: IPropTypes) => {
  const [editingKey, setEditingKey] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<NodesType | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<NodesType | undefined>();
  const [view, setView] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);

  const [triggerArchieve] = useMutation(userMutations.archiveCall);

  // & {key: React.Key}
  const edit = (record: NodesType) => {
    setEditingKey(record.id);
    setSelectedRecord(record);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleModal = (value: boolean) => {
    setOpen(value);
  }

  const handleCloseViewModal = (value: boolean) => {
    setView(value);
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

  const handleDeleteRecord = async () => {
    triggerArchieve({
      variables: {
        id: selectedRows.id
      }
    }).then(res => {
      handleRefetch();
      alert('Record Archieve/Unarchieved')
    }).catch(err => console.log(err));
  };

  return (
    <>
      {selectedRows && (
        <button className={styles.actionButton} style={{ width: '20%', marginBottom: '1rem' }} onClick={() => handleDeleteRecord()}>
          Archieve Selected Record
        </button>
      )}
      <Table
        style={{ zIndex: 0 }}
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
        rowSelection={{
          type: 'radio',
          onChange(selectedRowKeys, selectedRows, info) {
            setSelectedRows(selectedRows[0])
          },
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              setSelectedRecord(record);
              handleCloseViewModal(true);
            },
          };
        }}
      />
      <ReusableUpdateModal
        content={editingKey}
        handleCloseModal={handleModal}
        open={open}
        record={selectedRecord}
        loading={loading}
      >
      </ReusableUpdateModal>
      <ViewModal
        handleCloseModal={handleCloseViewModal}
        open={view}
        record={selectedRecord}
      >
      </ViewModal>
    </>
  );
};

export default TableContent;
