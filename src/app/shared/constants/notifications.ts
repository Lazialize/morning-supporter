import INotification from '../services/notification/interfaces/notification';

const notifications: {
  current: { [key: number]: INotification };
  future: { [key: number]: INotification };
} = {
  current: {
    2: {
      message: '雷を伴う雨が降っています。',
      color: 'danger',
      icon: 'alert-circle-outline',
    },
    3: {
      message: '霧雨が降っています。',
      color: 'danger',
      icon: 'alert-circle-outline',
    },
    5: {
      message: '雨が降っています。',
      color: 'danger',
      icon: 'alert-circle-outline',
    },
    6: {
      message: '雪が降っています。',
      color: 'danger',
      icon: 'alert-circle-outline',
    },
  },
  future: {
    2: {
      message: '雷を伴う雨が降る予定です。',
      color: 'warning',
      icon: 'alert-outline',
    },
    3: {
      message: '霧雨が降る予定です。',
      color: 'warning',
      icon: 'alert-outline',
    },
    5: {
      message: '雨が降る予定です。',
      color: 'warning',
      icon: 'alert-outline',
    },
    6: {
      message: '雪が降る予定です。',
      color: 'warning',
      icon: 'alert-outline',
    },
  },
};

export default notifications;
