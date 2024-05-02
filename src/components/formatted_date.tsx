import React from 'react';
import moment from 'moment';

interface DateProps {
    dateString: string;
}

const formatDate = (dateString: string): string => {
    return moment(dateString).format('YYYY-MM-DD HH:mm');
};

const DateDisplay: React.FC<DateProps> = ({ dateString }) => {
    return <div>{formatDate(dateString)}</div>;
};

export default DateDisplay;
