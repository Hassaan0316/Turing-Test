import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { NodesType } from 'types/dataTypes';
import styles from '@styles/Home.module.scss';
import { calculateMinutesSeconds } from 'utils/helperFunctions';
import { userMutations } from 'lib/apollo/mutations/userMutations';
import { useMutation } from '@apollo/client';

type ModalPropTypes = {
  open: boolean;
  loading: boolean;
  content: string;
  children: React.ReactNode,
  record: NodesType,
  save: () => Promise<void> | void;
  handleCloseModal: (value: boolean) => void;
};

const ReusableUpdateModal = ({ open, handleCloseModal, save, loading, content, children, record }: ModalPropTypes) => {
  const [note, setNote] = useState('');
  const [triggerAddNote] = useMutation(userMutations.addNote)

  // const { data, loading: subLoading, error } = useSubscription(subscriptionCall.updateSubstription);
  // console.log(data, error)

  const hideModal = () => {
    handleCloseModal(false);
  };

  const Title = () => {
    return (
      <div className={styles.modalTitle}>
        <h3>Add Notes</h3>
        <p>Call Id {content}</p>
        <hr style={{ width: '100%' }} />
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

  const saveNote = async () => {
    if (!note) {
      return alert("Please provide valid value");
    }
    await triggerAddNote({
      variables: {
        id: record.id,
        content: note
      }
    }).then((res) => {
      alert('Note added successfully');
      hideModal()
    }).catch(err => console.log(err));
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  }

  return (
    <>
      <Modal
        title={<Title />}
        open={open}
        confirmLoading={loading}
        onOk={() => saveNote()}
        onCancel={hideModal}
        okText="Save"
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
                <h4>Via</h4>
                <p>{record?.via}</p>
              </div>
            </li>
          </ul>
          <h4>Note</h4>
          <textarea style={{ padding: 10, resize: 'none' }} placeholder="Add Note" value={note} rows={4} onChange={handleChange}  >
          </textarea>
        </div>
      </Modal>
    </>
  );
};

export default ReusableUpdateModal;
