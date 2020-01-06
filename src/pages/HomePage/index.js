import React from 'react';
import CategoriesBar from '@/components/CategoriesBar';
import CATEGORIES from '@/assets/fakers/categories';
import styles from './index.less';

const Homepage = () => {
    let loading = false;
    let categories = CATEGORIES;
    return (
        <div className={styles.homepage}>
            <div className={styles.cateBar}>
                <CategoriesBar loading={loading} categories={categories} />
            </div>
        </div>
    )
};

export default Homepage;