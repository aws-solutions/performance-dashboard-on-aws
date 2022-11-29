/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

export interface Homepage {
  title: string;
  description: string;
  updatedAt: Date;
}

export interface HomepageItem {
  pk: string;
  sk: string;
  type: string;
  updatedAt?: string;
  title: string;
  description: string;
}
