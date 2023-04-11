import styles from "./OperationAppliedAlert.module.scss"

const OperationAppliedAlert = ({ message }: { message: string }) => (
  <div>
    {message}
    <div className={styles.divider_container}>
      <div className={styles.divider} />
    </div>
    <div className={styles.info_container}>
      <i aria-hidden className="fa-solid fa-info-circle" />
      <div className={styles.info}>
        There is a <b>30 second</b> indexer delay for this operation to appear
        on the website
      </div>
    </div>
  </div>
)

export const createOperationAppliedAlert = (message: string) => ({
  type: "success" as const,
  title: `Operation applied`,
  content: () => <OperationAppliedAlert message={message} />,
})
