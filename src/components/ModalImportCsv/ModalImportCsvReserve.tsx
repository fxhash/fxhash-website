import React, { memo, useCallback, useState } from 'react';
import style from "./ModalImportCsvReserve.module.scss";
import { Modal } from "../Utils/Modal";
import { ISplit } from "../../types/entities/Split";
import { Dropzone } from "../Input/Dropzone";
import cs from "classnames";
import { Button } from "../Button";
import text from "../../styles/Text.module.css";
import { transformSplitsAccessList } from "../../utils/transformers/splits";
import { InputSplits } from "../Input/InputSplits";
import { getDataFromCsvFile, hasCsvMissedColumns } from "../../utils/csv";
import { ErrorBlock } from "../Error/ErrorBlock";
import { Loader } from "../Utils/Loader";
import { isTezosAddress } from "../../utils/strings";
import { Spacing } from '../Layout/Spacing';

type FormatCsvDataToSplits = (data: any[]) => { errors: string[], splits: ISplit[] }
interface ModalImportCsvReserveProps {
  onClose: () => void
  onImport: (splits: ISplit[]) => void
}
const cols = ['address', 'amount'];
const _ModalImportCsvReserve = ({ onClose, onImport }: ModalImportCsvReserveProps) => {
  const [splits, setSplits] = useState<ISplit[]|false>(false);
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | false>(false);

  const handleClickImport = useCallback(() => onImport(splits as ISplit[]), [splits, onImport])
  const handleFormatCsvDataToSplits = useCallback<FormatCsvDataToSplits>((csvData) => {
    const errors: string[] = [];
    const addedAddresses: { [key: string]: number } = {};
    const splits = csvData.reduce((acc, { address, amount }, idx) => {
      const error: string[] = [];
      const line = idx + 2;
      if (address) {
        if (!isTezosAddress(address)) {
          error.push('tezos address invalid');
        }
        const addedAddressLine = addedAddresses[address]
        if (addedAddressLine) {
          error.push(`duplicate tezos address of line ${addedAddressLine}`);
        }
      } else {
        error.push('missing address')
      }

      if (error.length > 0) {
        errors.push(`${line}: ${error.join(',')}`)
      } else {
        addedAddresses[address] = line;
        acc.push(({ pct: amount, address }));
      }
      return acc;
    }, [] as ISplit[])
    return { errors, splits };
  }, [])
  const handleDropzoneChange = useCallback(async (files) => {
    setSplits(false);
    setError(false);
    if (!(files?.length > 0)) return
    const [file] = files;
    setFile(file);
    try {
      setLoading(true);
      const res = await getDataFromCsvFile(file);
      setLoading(false);
      if (res.errors.length > 0) {
	throw new Error(res.errors.map((err: Error) => err.message).join('\n'))
      }
      const missedColumns = hasCsvMissedColumns(res, cols);
      if (missedColumns) {
        throw new Error(`Missing columns in csv file: ${missedColumns.join(',')}`)
      }
      const { errors, splits } = handleFormatCsvDataToSplits(res.data);
      if (errors.length > 0) {
        setError(errors.join('\n'));
      }
      setSplits(splits);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }, [handleFormatCsvDataToSplits])

  return (
    <Modal
      title="Import users from .csv"
      onClose={onClose}
      className={style.modal}
    >
      <span className={cs(text.info)}>
        Use the following format to import users from a .csv file
      </span>
      <pre className={style.csv_example}>
        <code>
          address, amount<br/>
          tz1dtzgLYUHMhP6sWeFtFsHkHqyPezBBPLsZ, 2<br/>
          tz1PoDdN2oyRyF6DA73zTWAWYhNL4UGr3Egj, 4<br/>
        </code>
      </pre>
      <Spacing size="large"/>
      <Dropzone
        textDefault="Drop your .csv file here (or click to browse)"
        accepted={'text/csv'}
        files={file && [file]}
        onChange={handleDropzoneChange}
        className={style.dropzone}
      />
      <Spacing size="large"/>
      {error &&
        <ErrorBlock align="left" title="Import error">
          <div className={style.error}>{error}</div>
        </ErrorBlock>
      }
      {loading &&
        <div className={style.loading}>
          <Loader/>
        </div>
      }
      {splits &&
        <div className={style.splits}>
          <InputSplits
            value={splits}
            textShares="Nb of editions"
            defaultShares={1}
            sharesTransformer={transformSplitsAccessList}
            showPercentages={false}
            readOnly
          />
        </div>
      }
      <div className={style.container_import}>
        <Button
          type="button"
          size="regular"
          color="secondary"
          disabled={!splits || loading}
          onClick={handleClickImport}
        >
          import users
        </Button>
      </div>
    </Modal>
  );
};

export const ModalImportCsvReserve = memo(_ModalImportCsvReserve);
