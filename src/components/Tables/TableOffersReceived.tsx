import React, { Fragment, memo, useRef } from 'react';
import style from "./TableUser.module.scss";
import { DateDistance } from "../Activity/Action";
import { DisplayTezos } from "../Display/DisplayTezos";
import { UserBadge } from "../User/UserBadge";
import { ObjktImageAndName } from "../Objkt/ObjktImageAndName";
import Skeleton from "../Skeleton";
import cs from "classnames";
import useHasScrolledToBottom from "../../hooks/useHasScrolledToBottom";
import { Offer } from "../../types/entities/Offer";
import { useContractOperation } from '../../hooks/useContractOperation';
import { OfferAcceptOperation } from '../../services/contract-operations/OfferAccept';
import { Button } from '../Button';
import { ContractFeedback } from '../Feedback/ContractFeedback';

interface TableUserOffersReceivedProps {
  offers: Offer[],
  loading?: boolean,
  onScrollToBottom?: () => void,
}
const _TableUserOffersReceived = ({ offers, loading, onScrollToBottom }: TableUserOffersReceivedProps) => {
  const refWrapper = useRef<HTMLDivElement>(null);
  useHasScrolledToBottom(refWrapper, {
    onScrollToBottom,
    offsetBottom: 100
  });

  const {
    state,
    loading: callLoading,
    error,
    success,
    call,
    params: acceptParams,
  } = useContractOperation(OfferAcceptOperation)

  const acceptOffer = (offer: Offer) => {
    call({
      offer: offer,
      token: offer.objkt,
      price: offer.price
    })
  }

  return (
    <>
      <div ref={refWrapper} className={cs(style.wrapper)}>
        <table className={style.table}>
          <thead>
          <tr>
            <th className={style['th-gentk']}>Gentk</th>
            <th className={style['th-price']}>Price</th>
            <th className={style['th-user']}>From</th>
            <th className={style['th-time']}>Time</th>
            <th className={style['th-action']}>Action</th>
          </tr>
          </thead>
          <tbody>
            {(loading || offers.length > 0) ? offers.map(offer => (
              <Fragment key={`${offer.id}-${offer.version}`}>
                {acceptParams?.offer.id === offer.id && (
                  <tr className={cs(style.contract_feedback)}>
                    <td colSpan={6}>
                      <div className={cs(style.feedback_wrapper)}>
                        <ContractFeedback
                          state={state}
                          loading={callLoading}
                          success={success}
                          error={error}
                          successMessage="You have accepted the offer"
                          noSpacing
                        />
                      </div>
                    </td>
                  </tr>
                )}
                <tr>
                  <td className={style['td-gentk']}>
                    {offer.objkt && (
                      <div className={cs(style.link_wrapper)}>
                        <ObjktImageAndName
                          objkt={offer.objkt}
                          imagePriority
                        />
                      </div>
                    )}
                  </td>
                  <td className={style['td-price']}>
                    <DisplayTezos
                      className={style.price}
                      formatBig={false}
                      mutez={offer.price}
                      tezosSize="regular"
                    />
                  </td>
                  <td className={style['td-user']}>
                    <UserBadge
                      hasLink
                      user={offer.buyer}
                      size="small"
                      displayAvatar={false}
                    />
                  </td>
                  <td className={style['td-time']}>
                    <div className={style.date}>
                      <DateDistance
                        timestamptz={offer.createdAt}
                      />
                    </div>
                  </td>
                  <td>
                    <Button
                      type="button"
                      color="secondary"
                      size="very-small"
                      onClick={() => acceptOffer(offer)}
                      state={callLoading && acceptParams?.offer.id === offer.id ? "loading" : "default"}
                    >
                      accept
                    </Button>
                  </td>
                </tr>
              </Fragment>
            )) :
            <tr>
              <td className={style.empty} colSpan={6}>
                No offers found
              </td>
            </tr>
          }
          {loading && (
            [...Array(29)].map((_, idx) => (
              <tr key={idx}>
                <td className={style['td-gentk']}>
                  <div className={style['skeleton-wrapper']}>
                    <Skeleton className={style['skeleton-thumbnail']} height="40px" width="40px"/>
                    <Skeleton height="25px" width="100%"/>
                  </div>
                </td>
                <td className={style['td-user']}><Skeleton height="25px"/></td>
                <td className={style['td-price']}><Skeleton height="25px"/></td>
                <td className={style['td-time']}><Skeleton height="25px"/></td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
   </>
  );
}

export const TableUserOffersReceived = memo(_TableUserOffersReceived);
