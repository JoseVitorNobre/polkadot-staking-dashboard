// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FooterWrapper } from '../Wrappers';
import { useModal } from '../../contexts/Modal';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { BondInputWithFeedback } from '../../library/Form/BondInputWithFeedback';
import { ContentWrapper, Separator } from './Wrapper';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';

export const Forms = (props: any) => {
  const { setSection, task } = props;

  const { api, network }: any = useApi();
  const { setStatus: setModalStatus }: any = useModal();
  const { activeAccount } = useConnect();
  const { getBondOptions }: any = useBalances();
  const { freeToBond, freeToUnbond, totalPossibleBond } = getBondOptions(activeAccount);
  const { units } = network;

  // local bond value
  const [bond, setBond] = useState(freeToBond);

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // update bond value on task change
  useEffect(() => {
    let _bond = (task === 'bond_some' || task === 'bond_all')
      ? freeToBond
      : freeToUnbond;
    setBond({
      bond: _bond
    });
  }, [task]);

  // tx to submit
  const tx = () => {
    let tx = null;

    let bondToSubmit = bond.bond * (10 ** units);
    if (task === 'bond_some' || task === 'bond_all') {
      tx = api.tx.staking.bondExtra(bondToSubmit);

    } else if (task === 'unbond_some' || task === 'unbond_all') {
      tx = api.tx.staking.unbond(bondToSubmit);
    }
    return tx;
  }

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {
    }
  });

  return (
    <ContentWrapper>
      <div className='items'>
        {task === 'bond_some' &&
          <>
            <BondInputWithFeedback
              unbond={false}
              listenIsValid={setBondValid}
              defaultBond={freeToBond}
              setters={[{
                set: setBond,
                current: bond
              }]}
            />
          </>
        }
        {task === 'bond_all' &&
          <>
            <h4>Amount to bond:</h4>
            <h2>{freeToBond} {network.unit}</h2>
            <p>This amount of {network.unit} will be added to your current bonded funds.</p>
            <Separator />
            <h4>New total bond:</h4>
            <h2>{totalPossibleBond} {network.unit}</h2>
          </>
        }
        {task === 'unbond_some' &&
          <>
            <BondInputWithFeedback
              unbond={true}
              listenIsValid={setBondValid}
              defaultBond={freeToUnbond}
              setters={[{
                set: setBond,
                current: bond
              }]}
            />
            <p>Once unbonding, you must wait 28 days for your funds to become available.</p>
          </>
        }
        {task === 'unbond_all' &&
          <>
            <h4>Amount to unbond:</h4>
            <h2>{freeToUnbond} {network.unit}</h2>
            <p>Once unbonding, you must wait 28 days for your funds to become available.</p>
          </>
        }
        <div>
          <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>
        </div>
      </div>
      <FooterWrapper>
        <div>
          <button
            className='submit'
            onClick={() => setSection(0)}
          >
            <FontAwesomeIcon transform='shrink-2' icon={faChevronLeft} />
            Back
          </button>
        </div>
        <div>
          <button className='submit' onClick={() => submitTx()} disabled={submitting || !bondValid}>
            <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp} />
            Submit{submitting && 'ting'}
          </button>
        </div>
      </FooterWrapper>
    </ContentWrapper>
  )
}

export default Forms;