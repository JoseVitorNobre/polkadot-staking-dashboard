// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useNetworkMetrics } from '../../contexts/Network';

export const Browse = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const { metrics } = useNetworkMetrics();

  // counterForValidators

  const items = [
    {
      label: "Active Validators",
      value: 297,
      unit: "",
      format: "number",
    },
    {
      label: "Current Epoch",
      value: 1,
      unit: "",
      format: "number",
    },
    {
      label: "Current Era",
      value: metrics.activeEra.index,
      unit: "",
      format: "number",
    },
  ];

  return (
    <>
      <h1 className='title'>{title}</h1>
      <StatBoxList title="This Session" items={items} />
    </>
  );
}

export default Browse;