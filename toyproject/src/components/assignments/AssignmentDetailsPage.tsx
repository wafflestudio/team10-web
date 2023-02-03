import React, { useEffect, useState } from "react";
import SubjectTemplate from "../SubjectTemplate";
import styles from "./AssignmentDetailsPage.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  apiAssignmentScore,
  apiAssignments,
  apiGetFile,
  auth,
  url,
} from "../../lib/api";
import { useSessionContext } from "../../context/SessionContext";
import { UserAssignmentInterface } from "../../lib/types";
import { timestampToDateWithLetters } from "../../lib/formatting";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

export const apiAssignment = async (
  token: string | null,
  assignment_id: number
) => {
  return await axios({
    method: "get",
    url: url(`/etl/assignments/${assignment_id}/`),
    withCredentials: true,
    headers: auth(token),
  });
};

const isOpen = (due_date: string): boolean => {
  const timestamp = parseInt(due_date);
  return timestamp - Date.now() > 0;
};

const DownloadFile = ({
  file,
  token,
}: {
  file: string;
  token: string | null;
}) => {
  const originalFileURL = decodeURI(file);
  const urlParams = originalFileURL.split("assignments/")[1].split("?X-Amz")[0];
  const parts = urlParams.split(".");
  const extension = parts[parts.length - 1];
  const handleDownload = async (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    await apiGetFile(file, token, urlParams, extension);
  };

  return (
    <span className={styles.download} onClick={handleDownload}>
      {urlParams}
    </span>
  );
};

export default function AssignmentDetailsPage() {
  const { token, getRefreshToken } = useSessionContext();
  const { subjectid, assignmentID } = useParams();
  const [userAssignment, setUserAssignment] =
    useState<UserAssignmentInterface>();
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const onSubmission = () => {
    // 제출 함수
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await apiAssignment(
          token,
          parseInt(assignmentID as string)
        );
        const a = await apiAssignmentScore(token, res.data.id);
        setUserAssignment({
          assignment: res.data,
          is_submitted: a.data.is_submitted,
          is_graded: a.data.is_graded,
          score: a.data.score,
        });
      } catch {
        const localRefreshToken = localStorage.getItem("refresh");
        const resToken = await getRefreshToken(
          localRefreshToken ? localRefreshToken : "temp"
        );
        const newToken = resToken.data.access;
        const res = await apiAssignment(
          token,
          parseInt(assignmentID as string)
        );
        const a = await apiAssignmentScore(newToken, res.data.id);
        setUserAssignment({
          assignment: res.data,
          is_submitted: a.data.is_submitted,
          is_graded: a.data.is_graded,
          score: a.data.score,
        });
      }
    })();
  }, [token]);

  return (
    <SubjectTemplate
      subject={subjectid as string}
      page='과제'
      content={userAssignment?.assignment.name}
    >
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <header className={styles.header}>
            <p className={styles.title}>{userAssignment?.assignment.name}</p>
            <input
              type='file'
              id='fileUpload'
              style={{ display: "none" }}
              onChange={onSubmission}
            />
            <label htmlFor='fileUpload' className={styles.submit}>
              <p>
                {userAssignment?.is_submitted
                  ? "다시 제출하기"
                  : "과제 제출하기"}
              </p>
            </label>
          </header>
          <ul className={styles.details}>
            <b>마감</b>
            <li>
              {timestampToDateWithLetters(
                userAssignment?.assignment.due_date as string
              )}
            </li>
            <b>만점</b>
            <li>{userAssignment?.assignment.max_grade}</li>
            <b>파일</b>
            <li>
              {userAssignment?.assignment.file ? (
                <DownloadFile
                  file={userAssignment?.assignment.file}
                  token={token}
                ></DownloadFile>
              ) : (
                "파일 없음"
              )}
            </li>
          </ul>
          <article className={styles.content}>내용 없음</article>
        </div>
        <div className={styles.right}>
          <header>마감 여부</header>
          {isOpen(userAssignment?.assignment.due_date as string) ? (
            <b>
              <FontAwesomeIcon icon={faCircleCheck} className={styles.fa} />
              제출 가능
            </b>
          ) : (
            <b className={styles.closed}>
              <FontAwesomeIcon icon={faCircleXmark} className={styles.fa} />
              마감
            </b>
          )}
          <header>제출물</header>
          {userAssignment?.is_submitted ? (
            <b>
              <FontAwesomeIcon icon={faCircleCheck} className={styles.fa} />
              제출됨
              {userAssignment?.assignment.file
                ? userAssignment?.assignment.file
                : "파일 없음"}
            </b>
          ) : (
            <b className={styles.closed}>
              <FontAwesomeIcon icon={faCircleXmark} className={styles.fa} />
              제출하지 않음
            </b>
          )}
          <header>성적</header>
          {userAssignment?.is_graded ? (
            <b className={styles.score}>{"" + userAssignment?.score + "점"}</b>
          ) : (
            <b className={styles.score}>채점되지 않음</b>
          )}
        </div>
      </div>
    </SubjectTemplate>
  );
}
