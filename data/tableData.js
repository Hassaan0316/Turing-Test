import {capitalizeFirst} from 'utils/helperFunctions';
import styles from '@styles/Home.module.scss';

export const columns = [
  {
    title: <p>CALL TYPE</p>,
    dataIndex: 'call_type',
    key: 'call_type',
    width: 120,
    sorter: {
      compare: (a, b) => a.call_type.localeCompare(b.call_type),
      multiple: 1,
    },
    render: call_type => <p>{call_type}</p>,
  },
  {
    title: <p>DIRECTION</p>,
    dataIndex: 'direction',
    key: 'direction',
    render: direction => <p style={{color: 'blue'}}>{capitalizeFirst(direction)}</p>,
    width: 120,
  },
  {
    title: 'DURATION',
    dataIndex: 'duration',
    key: 'duration',
    width: 180,
    render: text => <p>{text}</p>,
  },
  {
    title: 'FROM',
    dataIndex: 'from',
    key: 'from',
    width: 150,
    render: text => <p>{text}</p>,
  },
  {
    title: 'TO',
    dataIndex: 'to',
    key: 'to',
    width: 110,
    render: text => <p>{text.toString()}</p>,
  },
  {
    title: 'VIA',
    dataIndex: 'via',
    key: 'via',
    width: 110,
    render: text => <p>{text}</p>,
  },
  {
    title: 'CREATED AT',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 120,
    sorter: {
      compare: (a, b) => a.created_at.localeCompare(b.created_at),
      multiple: 1,
    },
    render: text => {
      const updatedText = new Date(text).toLocaleString().split(',');
      return <p>{updatedText[0].split('/').join('-')}</p>;
    },
  },
  {
    title: 'Status',
    dataIndex: 'is_archived',
    key: 'is_archived',
    width: 120,
    render: text => (
      <div
        className={styles.statusButton}
        style={{
          backgroundColor: text ? 'rgb(118, 185, 71, .3)' : '	rgb(169,169,169, .3)',
          color: 'blue',
        }}>
        <p style={{color: text ? 'rgb(118, 185, 71, .8)' : '	rgb(169,169,169)'}}>
          {text ? 'Archieved' : 'Unarchieve'}
        </p>
      </div>
    ),
    sorter: {
      compare: (a, b) => a.is_archived.toString().localeCompare(b.is_archived),
      multiple: 1,
    },
  },
  {
    title: 'Action',
    key: 'action',
    dataIndex: 'action',
    width: 100,
    render: (_, record) => {
      return <span></span>;
    },
  },
];
