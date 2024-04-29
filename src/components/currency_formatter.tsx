import React from 'react';

interface CurrencyFormatterProps {
  price?: number;
}

const KRW: React.FC<CurrencyFormatterProps> = ({ price }) => {
    if (!price) return null

    const formatter = new Intl.NumberFormat('ko-KR', {
      style: 'decimal',
    })
    return <span>{formatter.format(price)} 원</span>
};

export default KRW;
