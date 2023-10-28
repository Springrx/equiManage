import { getUsers } from './service';
const locations = [
    {
        text: 'A栋',
        value: 'A栋',
    },
    {
        text: 'D栋',
        value: 'D栋',
    },
];
const state=[
    {
        text: '正在使用',
        value: 1,
    },
    {
        text: '已报废',
        value: 2,
    },
    {
        text: '闲置',
        value: 0,
    },
];
const selectStateOptions = [
                    {
                        value: 0,
                        label: '闲置',
                    },
                    {
                        value: 2,
                        label: '已报废',
                    },
                ]
const classfyInput = (dataIndex) => {
    switch (dataIndex) {
        case 'category':
            return 'selectCategory';
        case 'location':
            return 'selectLocation';
        case 'state':
            return 'selectState';
        case 'buy_time':
            return 'DatePicker';
        case 'photo_url':
            return 'upload';
        default:
            return 'textArea';
    }
}

export {  locations,state,classfyInput,selectStateOptions };