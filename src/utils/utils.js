import moment from 'moment';
import _ from 'lodash';

export const fromNow = unixTime => {
    const diff = moment().dayOfYear() - moment(unixTime).dayOfYear();
    if (diff === 0) return moment(unixTime).format("H:mm");
    if (diff < 7) return moment(unixTime).format("ddd");
    return moment(unixTime).format("MMM D");
};

export const truncate = (str, len = 60, sep = /,? +/) => {
    return _.truncate(str, {
        'length': len,
        'separator': sep
    });
};

export const range = n => {
    let i = 0;
    const result = [];
    while (i < n) {
        result.push(i);
        i++;
    }
    return result;
};

export const toQueryString= json => {
    return _.keys(json)
      .map(k => `${k}=${encodeURIComponent(json[k])}`)
      .join('&');
};

export const delay = ms => new Promise((res, rej) => setTimeout(res, ms));

export const findLimit = (data, minimum, number = false) => {
    const length = !number ? data.length : data;
    let i = minimum;
    while (length % i > 0 && i < length)
        i++;
    return i;
};

export const transAuthors = (authors, maxLength) => {
    if (_.isEmpty(authors)) return "";
    let authorsStr = authors[0];
    let i = 1;
    const n = authors.length;
    while (i < n) {
        if (i < n - 1) {
            if (authorsStr.length + 2 + authors[i].length <= maxLength) {
                authorsStr = `${authorsStr}, ${authors[i]}`;
                i++;
            }
            else {
                authorsStr = `${authorsStr} and ${n - i} others`;
                i = n;
            }
        }
        else {
            if (authorsStr.length + 5 + authors[i].length <= maxLength)
                authorsStr = `${authorsStr} and ${authors[i]}`;
            else authorsStr = `${authorsStr} and 1 other`;
            i++;
        }
    }
    return authorsStr;
};

export const roundStarRating = rating => {
    rating = parseFloat(rating);
    if (rating > 5) return 5.0;
    else if (rating < 0) return 0.0;
    const ceil = parseFloat(_.ceil(rating));
    if (rating < ceil) return ceil - 0.5;
    return rating;
};

export const  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const minutesToHour = mins => {
    if (mins < 60) return `${mins} mins`;
    let num = mins;
    let hours = (num / 60);
    let rhours = _.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = _.round(minutes);
    return rminutes > 0 ? `${rhours}h${rminutes}m` : `${rhours}h`;
};

export const checkValidLinkWithoutProtocol = link => {
    const hrefRegex = /^([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+.*)$/;
	return hrefRegex.test(link);
};

export const checkValidLink = link => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(link);
};

export const capitalText = name => {
    const matches = name.match(/\b(\w)/g); // ['J','S','O','N']
    return _.join(_.takeRight(matches, 2), '');
};

export const loadingData = (items, prefix, number) => {
    if (!items)
        return items;
    return _.concat(items, _.map(range(number), i => ({ key: _.uniqueId(prefix), loading: true })));
}