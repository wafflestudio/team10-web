import React, { useState } from 'react';
import styles from './SideNavBar.module.scss';
import { ReactComponent as Book } from '../../svg/book.svg';
import { ReactComponent as Calender } from '../../svg/calendar.svg';
import { ReactComponent as DashBoard } from '../../svg/dashboard.svg';
import { ReactComponent as Question } from '../../svg/question.svg';
import snulogo from '../../svg/snulogo.svg';
import { ReactComponent as UserIcon } from '../../svg/userIcon.svg';
import { SubjectModal } from './modal/SubjectModal';
import { AuthModal } from './modal/AuthModal';
import { Link, useNavigate } from 'react-router-dom';

export const SideNavBar = () => {
  const [subjectModal, setSubjectModal] = useState<boolean>(false);
  // const [authModal, setAuthModal] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<number>(0);
  const [aniState, setAniState] = useState(false);

  const navigate = useNavigate();

  const openSubjectModal = () => {
    setSubjectModal(true);
  };
  const closeSubjectModal = () => {
    setAniState(true);
    setTimeout(() => {
      setAniState(false);
      setSubjectModal(false);
    }, 500);
    setIsSelected(0);
  };

  // const openAuthModal = () => {
  //   setAuthModal(true);
  // };

  // const closeAuthModal = () => {
  //   setAniState(true);
  //   setTimeout(() => {
  //     setAniState(false);
  //     setAuthModal(false);
  //   }, 500);
  //   setIsSelected(0);
  // };

  //modal을 띄우지 않는 button을 클릭시 다른 모달 state를 모두 false로 만듦
  const closeOtherModal = () => {
    if (subjectModal) {
      setSubjectModal(false);
    } else {
      return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles['logo-container']}>
          <Link to='/'>
            <img src={snulogo} alt='snulogo'></img>
          </Link>
        </div>
        <div
          className={`${styles['button-container']} ${
            isSelected === 1 ? styles['selected'] : ''
          }`}
          // 계정과 과목 모달 띄울땐 그 외의 모달 state를 false로 함
          onClick={() => {
            setIsSelected(1);
            closeOtherModal();
            // openAuthModal();
            navigate('/user');
          }}
        >
          <UserIcon></UserIcon>
          계정
        </div>
        <Link to='/'>
          <div
            className={`${styles['button-container']} ${
              isSelected === 2 ? styles['selected'] : ''
            }`}
            onClick={() => {
              setIsSelected(2);
              closeOtherModal();
            }}
          >
            <DashBoard></DashBoard>
            대시보드
          </div>
        </Link>
        <div
          className={`${styles['button-container']} ${
            isSelected === 3 ? styles['selected'] : ''
          }`}
          onClick={() => {
            setIsSelected(3);
            closeOtherModal();
            openSubjectModal();
          }}
        >
          <Book></Book>
          과목
        </div>
        <div
          className={`${styles['button-container']} ${
            isSelected === 4 ? styles['selected'] : ''
          }`}
          onClick={() => {
            setIsSelected(4);
            closeOtherModal();
          }}
        >
          <Calender></Calender>
          캘린더
        </div>
        <div
          className={`${styles['button-container']} ${
            isSelected === 5 ? styles['selected'] : ''
          }`}
          onClick={() => {
            setIsSelected(5);
            closeOtherModal();
          }}
        >
          <Question></Question>
          이용안내
        </div>
      </div>
      {subjectModal && (
        <SubjectModal
          aniState={aniState}
          closeSubjectModal={closeSubjectModal}
        ></SubjectModal>
      )}
      {/* {authModal && (
        <AuthModal
          aniState={aniState}
          closeAuthModal={closeAuthModal}
        ></AuthModal>
      )} */}
    </div>
  );
};
