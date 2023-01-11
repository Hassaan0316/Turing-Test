import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { NodesType } from 'types/dataTypes';
import { calculateMinutesSeconds } from 'utils/helperFunctions';
import styles from '@styles/Home.module.scss';

type ModalPropTypes = {
  open: boolean;
  children: React.ReactNode,
  record: NodesType,
  handleCloseModal: (value: boolean) => void;
};

const ViewModal = ({ open, handleCloseModal, children, record }: ModalPropTypes) => {
  const [note, setNote] = useState('');

  // const { data, loading: subLoading, error } = useSubscription(subscriptionCall.updateSubstription);
  // console.log(data, error)

  const hideModal = () => {
    handleCloseModal(false);
  };

  const Title = () => {
    return (
      <div className={styles.modalTitle}>
        <h3 style={{ marginBottom: '.5rem' }}>Call Information</h3>
        <hr />
      </div>
    )
  }

  const timeValue = useMemo(() => {
    if (record) {
      const timeValue = calculateMinutesSeconds(record.duration);
      return {
        minutes: timeValue.minutes,
        seconds: timeValue.seconds,
      }
    }
  }, [record])

  const created = useMemo(() => {
    if (record) {
      const d = new Date(record.created_at).toLocaleString().split(',')
      return d
    }
  }, [record])

  const saveNote = async () => {
    hideModal()
  }

  return (
    <>
      <Modal
        title={<Title />}
        open={open}
        onOk={() => saveNote()}
        onCancel={hideModal}
        okText="Ok"
        style={{ top: 100 }}
        cancelText="Cancel">
        <div className={styles.modal__contentWrapper}>
          <ul>
            <li>
              <div>
                <h4>Call Type</h4>
                <p>{record?.call_type}</p>
              </div>
            </li>
            <li>
              <div>
                <h4>Duration</h4>
                {timeValue && `${timeValue.minutes} minutes ${timeValue.seconds} seconds`}
              </div>
            </li>
            <li>
              <div>
                <h4>From</h4>
                <p>{record?.from}</p>
              </div>
            </li>
            <li>
              <div>
                <h4>To</h4>
                <p>{record?.to}</p>
              </div>
            </li>
            <li>
              <div>
                <h4>ID</h4>
                <p>{record?.id}</p>
              </div>
            </li>
            <li>
              <div>
                <h4>direction</h4>
                <p>{record?.direction}</p>
              </div>
            </li>
            <li>
              <div>
                <h4>Is Archived</h4>
                <p>{record?.is_archived.toString()}</p>
              </div>
            </li>
            <li>
              <div>
                <h4>Created At</h4>
                <p> {created && created[0]} {created && created[1]}</p>
              </div>
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default ViewModal;
