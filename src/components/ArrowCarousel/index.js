import React, { useState } from 'react';
import _ from 'lodash';
import { Carousel, Icon } from 'antd';
import { range } from '@/utils/utils';

const SlickButton = ({currentSlide, slideCount, children, ...props}) => (
    <span {...props}>{children}</span>
);

export default ({ children, pageSize, dataSource, renderItem, renderEmptyItem, buttonSize, ...props }) => {
    const length = dataSource.length;
    const maxPage = _.ceil(length / pageSize);
    const [currentPage, setCurrentPage] = useState(1);
    return (
        <Carousel
            arrows
            dots={false}
            infinite={false}
            slidesToShow={pageSize}
            slidesToScroll={pageSize}
            prevArrow={currentPage > 1 ? <SlickButton ><Icon onClick={() => setCurrentPage(currentPage - 1)}type="left" style={{ color: '#FADA5E', fontSize: buttonSize }}/></SlickButton> : null}
            nextArrow={currentPage < maxPage ? <SlickButton ><Icon type="right" onClick={() => setCurrentPage(currentPage + 1)} style={{ color: '#FADA5E', fontSize: buttonSize }}/></SlickButton> : null}
            {...props}
        >
                {_.map(dataSource, data => <React.Fragment key={_.uniqueId('item_')}>{renderItem(data)}</React.Fragment>)}
                {_.map(range(pageSize - length), n => <React.Fragment key={n}>{renderEmptyItem(n)}</React.Fragment>)}
        </Carousel>
    )
}