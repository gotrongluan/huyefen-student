import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Button, message, Slider, Row, Col, Menu, Tooltip, Popover, Dropdown, Spin, Divider } from 'antd';
import {
    FullscreenOutlined, CloseOutlined, CaretRightFilled, PauseOutlined, ReloadOutlined, PlayCircleFilled,
    Loading3QuartersOutlined, FrownOutlined, BackwardOutlined, StepForwardOutlined, FullscreenExitOutlined, RetweetOutlined, LinkOutlined,
    FileTextFilled, SettingFilled, CheckOutlined, InfoCircleOutlined, QuestionCircleOutlined, SoundFilled
} from '@ant-design/icons';
import Slide from 'react-reveal/Slide';
import Fade from 'react-reveal/Fade';
import Caption from '@/elements/icon/caption';
import { videoRates as rates } from '@/config/constants';
import { secondsToTime } from '@/utils/utils';
import logo from '@/assets/images/logo_trans.png';

import styles from './default.less';

const MenuItem = Menu.Item;

const Video = ({ onFinish, nextLecture, onGoToNextLecture, videoRes, resolutions, baseWidth, baseHeight, captions, onSelectResolution, downloadable, ...props }) => {
    const divRef = useRef(null);
    const videoRef = useRef(null);
    const sliderRef = useRef(null);
    const previewRef = useRef(null);
    const [srcObj, setSrcObj] = useState(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [loop, setLoop] = useState(false);
    const [controlVisible, setControlVisible] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [controlTimer, setControlTimer] = useState(null);
    const [duration, setDuration] = useState(null);
    const [currentTime, setCurrentTime] = useState({
        changing: false,
        value: 0
    });
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [bufferTime, setBufferTime] = useState(0);
    const [playingStatus, setPlayingStatus] = useState(1);
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState({
        status: 0,
        text: ''
    });
    const [preview, setPreview] = useState({
        visible: false,
        time: 0,
        left: 0,
        bottom: 0
    });
    const [previewWidth, setPreviewWidth] = useState(0);
    const [previewHeight, setPreviewHeight] = useState(0);
    const [volume, setVolume] = useState(0);
    const [oldVolume, setOldVolume] = useState(0);
    const [volumeVisible, setVolumeVisible] = useState(false);
    const [playbackRate, setPlaybackRate] = useState("1.0");
    const [rateVisible, setRateVisible] = useState(false);
    const [oldCurTime, setOldCurTime] = useState(null);
    const [caption, setCaption] = useState('off');
    const [captionText, setCaptionText] = useState([]);
    const [captionVisible, setCaptionVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [timeCount, setTimeCount] = useState({
        timeStart: null,
        timePlayed: 0
    });
    const [timerToNextLecture, setTimerToNextLecture] = useState({
        timeInterval: 0,
        second: 0
    });
    useEffect(() => {
        if (videoRef.current) {
            const videoEle = videoRef.current;
            videoEle.ondurationchange = () => setDuration(videoEle.duration);
            videoEle.onloadedmetadata = () => {
                const videoHeight = videoEle.videoHeight;
                const videoWidth = videoEle.videoWidth;
                let realHeight, realWidth, realPreviewHeight, realPreviewWidth;
                if (videoWidth / videoHeight < 4 / 3) {
                    realHeight = baseHeight;
                    realWidth = (baseHeight / videoHeight) * videoWidth;
                    realPreviewHeight = 84;
                    realPreviewWidth = (84 / videoHeight) * videoWidth;
                }
                else {
                    const divEle = divRef.current;
                    if (divEle) {
                        const divWidth = divEle.clientWidth;
                        realWidth = divWidth;
                        realHeight = (realWidth / videoWidth) * videoHeight;
                        realPreviewWidth = 160;
                        realPreviewHeight = (realPreviewWidth / videoWidth) * videoHeight;
                    }
                }
                setPreviewWidth(realPreviewWidth);
                setPreviewHeight(realPreviewHeight);
                setWidth(realWidth);
                setHeight(realHeight);
            };
            videoEle.onloadeddata = () => {
                //setPlayingStatus(videoEle.autoplay ? 0 : 1);
                setVolume(videoEle.volume);
                if (videoEle.volume === 0) setOldVolume(1); else setOldVolume(videoEle.volume);

            };
            videoEle.onprogress = () => {
                let buffer = 0;
                for (let i = 0; i < videoEle.buffered.length; i++) {
                    if (videoEle.buffered.start(videoEle.buffered.length - 1 - i) <= videoEle.currentTime) {
                        buffer = videoEle.buffered.end(videoEle.buffered.length - 1 - i);
                        setBufferTime(buffer);
                        return;
                    }
                } 
            };
            videoEle.oncanplay = () => {
                setError({
                    status: 0,
                    text: ''
                });
            };
            videoEle.ontimeupdate = () => {
                setCurrentTime(prevState => {
                    if (prevState.changing) return { ...prevState };
                    return {
                        changing: false,
                        value: videoEle.currentTime
                    };
                })
            }
            videoEle.onwaiting = () => setWaiting(true);
            videoEle.onplaying = () => setWaiting(false);
            videoEle.onplay = () => {
                setTimerToNextLecture(oldTimer => {
                    if (oldTimer.timeInterval === 0) return oldTimer;
                    clearInterval(oldTimer.timeInterval);
                    return{
                        timeInterval: 0,
                        second: 0
                    };
                })
                if (timeCount.timeStart === null) {
                    setTimeCount(old => ({
                        ...old,
                        timeStart: new Date().getTime() / 1000
                    }))
                }
                setPlayingStatus(0)
            };
            videoEle.onpause = () => {
                setPlayingStatus(1);
                countTimePlayed();
            }
            videoEle.onended = () => {
                setPlayingStatus(2);
                setTimerToNextLecture(oldTimer => {
                    if (oldTimer.timeInterval === 0 && nextLecture !== null) {
                        const intervalId = setInterval(() => {
                            setTimerToNextLecture(oldValue => {
                                if (oldValue.second === 1) {
                                    onGoToNextLecture(nextLecture);
                                    clearInterval(oldValue.timeInterval);
                                    return {
                                        timeInterval: 0,
                                        second: 0
                                    };
                                }
                                else {
                                    return {
                                        ...oldValue,
                                        second: oldValue.second - 1
                                    };
                                }
                            })
                        }, 1000);
                        return {
                            timeInterval: intervalId,
                            second: 6
                        };
                    }
                    return oldTimer;
                });
            }
            videoEle.onerror = () => handleError('Sorry, there was an error');
            videoEle.onstalled = () => handleError('Sorry, the video is not available.');
            videoEle.onabort = () => handleError('Sorry, the video is stoped downloading.');
            return () => {
                videoEle.ondurationchange = null;
                videoEle.onloadeddata = null;
                videoEle.onloadedmetadata = null;
                videoEle.onprogress = null;
                videoEle.oncanplay = null;
                videoEle.ontimeupdate = null;
                videoEle.onwaiting = null;
                videoEle.onplaying = null;
                videoEle.onplay = null;
                videoEle.onpause = null;
                videoEle.onended = null;
                videoEle.onerror = null;
                videoEle.onstalled = null;
                videoEle.onabort = null;
            };
        }
    }, []);
    useEffect(() => {
        const fullscreenFn = e => setFullScreen(!!document.fullscreenElement);
        const webkitFullScreenFn = e => setFullScreen(!!document.webkitFullscreenElement);
        const mozFullscreenFn = e => setFullScreen(!!document.mozFullscreenElement);
        const msFullscreenFn = e => setFullScreen(!!document.msFullscreenElement);
        document.addEventListener('fullscreenchange', fullscreenFn, false);
        document.addEventListener('webkitfullscreenchange', webkitFullScreenFn, false);
        document.addEventListener('mozfullscreenchange', mozFullscreenFn, false);
        document.addEventListener('msfullscreenchange', msFullscreenFn, false);
        return () => {
            document.removeEventListener('fullscreenchange', fullscreenFn);
            document.removeEventListener('webkitfullscreenchange', webkitFullScreenFn);
            document.removeEventListener('mozfullscreenchange', mozFullscreenFn);
            document.removeEventListener('msfullscreenchange', msFullscreenFn);
        };
    }, []);
    useEffect(() => {
        if (timeCount.timePlayed && duration) {
            if (timeCount.timePlayed / duration > 0.85) {
                onFinish();
            }
        }
    }, [timeCount.timePlayed]);
    useEffect(() => {
        setSrcObj(resolutions[videoRes].src);
        return () => {
            setBufferTime(0);
            setWidth(0);
            setHeight(0);
            setPlaybackRate('1.0');
            setSrcObj(null);
        };
    }, [resolutions]);
    useEffect(() => {
        if (oldCurTime !== null) {
            setBufferTime(0);
            setSrcObj(resolutions[videoRes].src);
        }
    }, [videoRes]);
    useEffect(() => {
        if (srcObj && oldCurTime  !== null) {
            const videoEle = videoRef.current;
            if (videoEle) {
                videoEle.currentTime = oldCurTime;
                if (playingStatus === 0) videoEle.play();
                handleSelectRate(playbackRate, true);
                setOldCurTime(null);
            }
        }
    }, [srcObj]);
    const handleError = messageText => {
        setError({
            status: 1,
            text: messageText
        });
        setWidth(prevWidth => prevWidth === 0 ? '100%' : prevWidth);
        setHeight(prevHeight => prevHeight === 0 ? 525 : prevHeight);
    };
    const handleTogglePlay = () => {
        const videoEle = videoRef.current;
        if (videoEle) {
            if (playingStatus === 0) videoEle.pause();
            else if (playingStatus === 2) {
                setCurrentTime({
                    changing: false,
                    value: 0
                });
                videoEle.play();
            }
            else videoEle.play();
        }
    };
    const handleChangeCurrentTime = value => {
        const videoEle = videoRef.current;
        if (videoEle) {
            videoEle.currentTime = value;
            setCurrentTime({
                changing: false,
                value
            });
        }
    };
    const countTimePlayed = () => {
        setTimeCount(old => {
            const curTime = new Date().getTime() / 1000;
            const curTimePlayed = curTime - old.timeStart;
            return {
                timeStart: null,
                timePlayed: old.timePlayed + curTimePlayed
            };
        })
    };
    const handleMouseOnSlider = e => {
        const offsetX = e.nativeEvent.offsetX;
        const sliderWidth = sliderRef.current.clientWidth;
        const time = (offsetX / sliderWidth) * duration;
        const clientX = e.clientX;
        const clientY = e.clientY;
        const left = clientX - 82;
        const bottom = window.innerHeight - clientY + 16;
        previewRef.current.currentTime = time;
        setPreview({
            visible: true,
            time,
            left,
            bottom
        });
    };
    const resetPreview = () => {
        setPreview({
            visible: false,
            time: 0,
            left: 0,
            bottom: 0
        });
    };
    const handleMouseMove = () => {

        if (!menuOpen) {
            setControlVisible(true);
            if (controlTimer) 
                clearTimeout(controlTimer);
            setControlTimer(setTimeout(() => {
                setControlTimer(null);
                setControlVisible(false);
            }, 2500));
        }
    };
    const handlePlayForward = () => {
        const videoEle = videoRef.current;
        if (videoEle) {
            videoEle.currentTime = videoEle.currentTime + 15;
            if (videoEle.pause) videoEle.play();
        }
    };
    const handleSetVolume = value => {
        const videoEle = videoRef.current;
        if (videoEle) {
            videoEle.volume = value;
            if (value > 0) setOldVolume(value);
        }
    };
    const handleToggleVolume = () => {
        const videoEle = videoRef.current;
        if (videoEle) {
            if (volume > 0) {
                setVolume(0);
                videoEle.volume = 0;
            }
            else {
                setVolume(oldVolume);
                videoEle.volume = oldVolume;
            }
        }
    };
    const handleToggleExpand = () => {
        const divEle = divRef.current;
        if (!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement)) {
            if (divEle.requestFullscreen) {
                divEle.requestFullscreen()
                    .catch(err => message.error(`Error attempting to enable full-screen mode: ${err.message}`));
            }
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                    .catch(err => message.error(`Error attempting to exit full-screen mode: ${err.message}`));
                
            }
        }
    };
    const processVisibleWithTimeout = visible => {
        if (visible) {
            if (controlTimer) {
                clearTimeout(controlTimer);
                setControlTimer(null);
            }
            setMenuOpen(true);
        }
        else {
            setControlTimer(setTimeout(() => {
                setControlTimer(null);
                setControlVisible(false);
            }, 2500));
            setMenuOpen(false);
        }
    }
    const handleRateVisibleChange = visible => {
        processVisibleWithTimeout(visible);
        setRateVisible(visible);
    };
    const handleSelectRate = (rateKey, fromEffect = false) => {
        const videoEle = videoRef.current;
        if (videoEle) {
            videoEle.playbackRate = _.toNumber(rateKey);
            setPlaybackRate(rateKey);
            if (!fromEffect) handleRateVisibleChange(false);
        }
    };
    const handleSelectOption = ({ key }) => {
        if (key === "loop") {
            setLoop(!loop);
        }
        else message.warning('Sorry, this function is not available!');
    };
    const handleSelectCaption = (captionId, captionLang) => {
        const videoEle = videoRef.current;
        if (videoEle) {
            if (captionLang === 'off') {
                if (caption !== 'off') {
                    const idx = _.findIndex(videoEle.textTracks, track => track.language === caption);
                    videoEle.textTracks[idx].mode = 'disabled';
                    videoEle.textTracks[idx].oncuechange = null;
                    setCaptionText([]);
                }
            }
            else if (captionLang !== caption) {
                for (let i = 0; i < videoEle.textTracks.length; ++i) {
                    const track = videoEle.textTracks[i];
                    if (track.language === caption) {
                        track.mode = 'disabled';
                        track.oncuechange = null;
                    }
                    if (track.language === captionLang) {
                        track.mode = 'hidden';
                        track.oncuechange = () => {
                            const cues = track.activeCues;
                            let ret = [];
                            _.forEach(cues, cue => ret.push({
                                key: cue.startTime,
                                val: cue.text
                            }));
                            setCaptionText(ret);
                        };
                    }
                }
            }
            setCaption(captionLang);
            handleCaptionVisibleChange(false);
        }
    };
    const handleCaptionVisibleChange = visible => {
        processVisibleWithTimeout(visible);
        setCaptionVisible(visible);
    };
    const handleSelectResolution = resolution => {
        const videoEle = videoRef.current;
        if (videoEle && videoRes !== resolution) {
            const curTime = videoEle.currentTime;
            setOldCurTime(curTime);
            onSelectResolution(resolution);
            //handleSettingsVisibleChange(false);
        }
        
    };
    const handleSettingsVisibleChange = visible => {
        processVisibleWithTimeout(visible);
        setSettingsVisible(visible);
    };
    const playbackRateMenu = (
        <div className={styles.ratesMenu}>
            {_.map(_.orderBy(_.keys(rates), key => key, ['desc']), rateKey => (
                <div
                    key={rateKey}
                    className={rateKey === playbackRate ? classNames(styles.rate, styles.selectedRate) : styles.rate}
                    onClick={() => handleSelectRate(rateKey)}
                >
                    {rates[rateKey]}
                </div>
            ))}
        </div>
    );
    const captionsMenu = (
        <div className={styles.captionsMenu}>
            <div
                key='off'
                className={styles.caption}
                onClick={() => handleSelectCaption('off', 'off')}
                style={{ color: caption === 'off' ? '#fada5e' : 'inherit' }}
            >
                Off
                {caption === 'off' && (<span className={styles.tick} />)}
            </div>
            {_.map(captions, captionItem => (
                <div
                    key={captionItem._id}
                    className={styles.caption}
                    onClick={() => handleSelectCaption(captionItem._id, captionItem.srcLang)}
                    style={{ color: caption === captionItem.srcLang ? '#fada5e' : 'inherit' }}
                >
                    {captionItem.label}
                    {caption === captionItem.srcLang && (<span className={styles.tick} />)}
                </div>
            ))}
        </div>
    );
    const settingsMenu = (
        <div className={styles.settingsMenu}>
            <div className={styles.resolutionsMenu}>
                {_.map(_.orderBy(_.toArray(resolutions), ['resolution'], ['desc']), resObj => (
                    <div
                        key={resObj.resolution}
                        className={styles.resolution}
                        onClick={() => handleSelectResolution(resObj.resolution)}
                        style={{ color: resObj.resolution === videoRes ? '#fada5e' : 'inherit' }}
                    >
                        {`${resObj.resolution}p`}
                        {resObj.resolution === videoRes && (<span className={styles.tick} />)}
                    </div>
                ))}
            </div>
            <Divider className={styles.divider} />
            <div className={styles.actionsMenu}>
                <div className={styles.action}>
                    Rebort technical issue
                </div>
                <div className={styles.action}>
                    Rebort abuse
                </div>
            </div>
        </div>        
    );
    const dropdownMenu = (
        <Menu className={styles.dropdownMenu} selectedKeys={[]} onClick={handleSelectOption}>
            <MenuItem key="loop">
                <RetweetOutlined />Loop
                {loop && (
                    <span className={styles.loopOk}>
                        <CheckOutlined />
                    </span>
                )}
            </MenuItem>
            <MenuItem key="copy">
                <LinkOutlined />Copy URL video
            </MenuItem>
            <MenuItem key="help">
                <QuestionCircleOutlined />Help center
            </MenuItem>
            <MenuItem key="info">
                <InfoCircleOutlined />Information detail
            </MenuItem>
        </Menu>
    );
    return  (
        <React.Fragment>
            {(width === 0 || height === 0) && (
                <div className={styles.fetching}>
                    <Spin size="large" />
                </div>
            )}
            <div
                className={styles.defaultVideo}
                ref={divRef} style={{ height: height, width: baseWidth }}
                onMouseMove={handleMouseMove}
            >
                <Dropdown overlay={dropdownMenu} trigger={['contextMenu']} overlayClassName={styles.contextDropdown} getPopupContainer={() => divRef.current}>
                    <video
                        {...props}
                        ref={videoRef}
                        src={srcObj}
                        className={styles.videoEle}
                        width={!fullScreen ? width : '100%'}
                        height={!fullScreen ? height : '100%'}
                        onClick={handleTogglePlay}
                        loop={loop}
                        controlsList="nodownload"
                        onContextMenu={e => {
                            e.preventDefault();
                            return false;
                        }}
                        crossOrigin="use-credentials"
                    >
                        {_.map(captions, captionItem => (
                            <track
                                key={captionItem._id}
                                label={captionItem.label}
                                kind="subtitles"
                                srcLang={captionItem.srcLang}
                                src={captionItem.src}
                            />
                        ))}
                    </video>
                </Dropdown>
                {width > 0 && height > 0 && (
                    <>
                        <Slide
                            duration={200}
                            bottom
                            when={controlVisible}
                        >
                            <div className={styles.controlBarOuter}>
                                <div className={styles.controlBar}>
                                    <Row gutter={8}>
                                        <Col className={styles.playStatus} span={2}>
                                            <div className={styles.val} onClick={handleTogglePlay}>
                                                {playingStatus === 1 ? (
                                                    <Tooltip placement="top" mouseEnterDelay={1} title="Play" getPopupContainer={() => divRef.current}>
                                                        <CaretRightFilled />
                                                    </Tooltip>
                                                ) : playingStatus === 0 ? (
                                                    <Tooltip placement="top" mouseEnterDelay={1} title="Pause" getPopupContainer={() => divRef.current}>
                                                        <PauseOutlined />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip placement="top" mouseEnterDelay={1} title="Reload" getPopupContainer={() => divRef.current}>
                                                        <ReloadOutlined />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </Col>
                                        <Col className={styles.center} span={16}>
                                            {/* <Divider type="vertical" /> */}
                                            <Row gutter={8}>
                                                <Col className={styles.playbackRate} span={2}>
                                                    <div>
                                                        <Tooltip placement="top" mouseEnterDelay={1} title="Playback rate" getPopupContainer={() => divRef.current}>
                                                            <Popover
                                                                trigger="click"
                                                                content={playbackRateMenu}
                                                                arrowPointAtCenter
                                                                placement="top"
                                                                visible={rateVisible}
                                                                onVisibleChange={handleRateVisibleChange}
                                                                popupClassName={styles.ratesPopover}
                                                                getPopupContainer={() => divRef.current}
                                                            >
                                                                <span className={styles.val}>
                                                                    {`${playbackRate}x`}
                                                                </span>
                                                            </Popover>
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                                <Col className={styles.currentTime} span={3}>
                                                    <span className={styles.val}>
                                                        {secondsToTime(currentTime.value)}
                                                    </span>
                                                </Col>
                                                <Col className={styles.sliderCol} span={15}>
                                                    <div className={styles.slider} onMouseMove={handleMouseOnSlider} onMouseLeave={resetPreview} ref={sliderRef}>
                                                        <Slider
                                                            min={0}
                                                            max={_.round(duration, 1)}
                                                            step={0.1}
                                                            value={currentTime.value}
                                                            onChange={value => {
                                                                setCurrentTime({
                                                                    value,
                                                                    changing: true
                                                                });
                                                            }}
                                                            onAfterChange={handleChangeCurrentTime}
                                                            tooltipVisible={false}
                                                        />
                                                        <span className={styles.buffered} style={{ width: `${(bufferTime * 100) / duration}%` }}/>
                                                    </div>
                                                </Col>
                                                <Col className={styles.endTime} span={3}>
                                                    <span className={styles.val}>
                                                        {secondsToTime(duration)}
                                                    </span>
                                                </Col>
                                                <Col className={styles.forward} span={1}>
                                                    <div onClick={handlePlayForward}>
                                                        <Tooltip placement="top" mouseEnterDelay={1} title="Forward 15s">
                                                            <StepForwardOutlined />
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                            </Row>
                                            {/* <Divider type="vertical" /> */}
                                        </Col>
                                        <Col className={styles.options} span={6}>
                                            <Row>
                                                <Col span={5} className={styles.transcript}>
                                                    <Tooltip mouseEnterDelay={1} title="Transcript" placement="top">
                                                        <FileTextFilled />
                                                    </Tooltip>
                                                </Col>
                                                <Col span={5} className={styles.subtitles}>
                                                    <Tooltip placement="top" mouseEnterDelay={1} title="Subtitles">
                                                        <Popover
                                                            getPopupContainer={() => divRef.current}
                                                            content={captionsMenu}
                                                            placement="top"
                                                            arrowPointAtCenter
                                                            visible={captionVisible}
                                                            onVisibleChange={handleCaptionVisibleChange}
                                                            popupClassName={styles.captionsPopover}
                                                            trigger="click"
                                                        >
                                                            <span>
                                                                <Caption />
                                                            </span>
                                                        </Popover>
                                                    </Tooltip>
                                                </Col>
                                                <Col span={5} className={styles.settings}>
                                                    <Tooltip placement="top" mouseEnterDelay={1} title="Setting">
                                                        <Popover
                                                            getPopupContainer={() => divRef.current}
                                                            content={settingsMenu}
                                                            placement="top"
                                                            arrowPointAtCenter
                                                            visible={settingsVisible}
                                                            onVisibleChange={handleSettingsVisibleChange}
                                                            popupClassName={styles.settingsPopover}
                                                            trigger="click"
                                                        >
                                                            <span>
                                                                <SettingFilled />
                                                            </span>
                                                        </Popover>
                                                    </Tooltip>
                                                </Col>
                                                <Col span={9} className={styles.logo}>
                                                    <img src={logo} alt="logo" />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Slide>
                        <div className={styles.expand} onClick={handleToggleExpand}>
                            <Tooltip placement="top" mouseEnterDelay={1} title={fullScreen ? "Collapse" : "Full screen"}>
                                <span className={styles.btn}>
                                    {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                                </span>
                            </Tooltip>
                        </div>
                        <div
                            className={styles.volume}
                            style={{ width: volumeVisible ? '144px' : '42px' }}
                            onMouseEnter={() => setVolumeVisible(true)}
                            onMouseLeave={() => setVolumeVisible(false)}
                        >
                            <Row>
                                <Col span={5}>
                                    <div className={styles.btn} onClick={handleToggleVolume}>
                                        <span className={styles.sound}>
                                            <SoundFilled />
                                        </span>
                                        {volume === 0 && (
                                            <span className={styles.stop}>
                                                <CloseOutlined />
                                            </span>
                                        )}
                                    </div>
                                </Col>
                                <Col span={19}>
                                    <div className={!volumeVisible ? styles.hiddenSlider : undefined}>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={volume}
                                            onChange={value => setVolume(value)}
                                            onAfterChange={handleSetVolume}
                                            tooltipVisible={false}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        {!_.isEmpty(captionText) && (
                            <div className={controlVisible ? classNames(styles.captionTexts, styles.moveCaptionTexts) : styles.captionTexts}>
                                <div className={styles.inner}>
                                    {_.map(captionText, (text, i) => (
                                        <React.Fragment key={text.key}>
                                            {i > 0 && <br />}
                                            <Fade duration={200} bottom>
                                                <span className={styles.text}>
                                                    {text.val}
                                                </span>
                                            </Fade>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                        {playingStatus === 2 && (
                            <div className={classNames(styles.overlay, styles.replay)}>
                                <div className={styles.outer}>
                                    <div className={styles.inlineDiv}>
                                        <div onClick={handleTogglePlay}><ReloadOutlined style={{ fontSize: '84px', cursor: 'pointer' }}/></div>
                                        <div className={styles.text}>Play again</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {playingStatus === 1 && (
                            <div className={classNames(styles.overlay, styles.replay)}>
                                <div className={styles.outer}>
                                    <div className={styles.inlineDiv}>
                                        <div onClick={handleTogglePlay}><PlayCircleFilled style={{ fontSize: '84px', cursor: 'pointer' }}/></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {waiting && (
                            <div className={styles.overlay}>
                                <div className={styles.outer}>
                                    <div className={styles.inlineDiv}>
                                        <Loading3QuartersOutlined style={{ fontSize: '84px', cursor: 'pointer', color: 'white' }} spin/>
                                    </div>
                                </div>
                            </div>
                        )}
                        {error.status === 1 && (
                            <div className={classNames(styles.overlay, styles.error)}>
                                <div className={styles.outer}>
                                    <div className={styles.inlineDiv}>
                                        <FrownOutlined />
                                        <span className={styles.text}>{error.text}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div
                            className={styles.preview}
                            style={{
                                left: preview.left,
                                bottom: preview.bottom,
                                visibility: preview.visible ? 'visible' : 'hidden',
                                height: previewHeight + 4
                            }}
                        >
                            <div className={styles.inner}>
                                <video muted ref={previewRef} className={styles.videoElement} width={previewWidth} height={previewHeight} src={srcObj} />
                                <span className={styles.time}>{`${secondsToTime(preview.time)}`}</span>
                            </div>
                        </div>
                    </>
                )}
                {timerToNextLecture.timeInterval > 0 && (
                    <div className={styles.timerToNext}>
                        <span className={styles.second}>{timerToNextLecture.second}</span>
                        <div className={styles.text}>Go to next lecture</div>
                    </div>
                )}
            </div>

        </React.Fragment>
    )
}

export default Video;