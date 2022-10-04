"use strict";

import { AttributeListType } from "aws-sdk/clients/cognitoidentityserviceprovider";

interface poolDataType {
  UserPoolId: string | undefined;
  Username: string;
  DesiredDeliveryMediums: string[];
  UserAttributes: AttributeListType;
}

interface passwordDataType {
  Password: string | undefined;
  UserPoolId: string | undefined;
  Username: string;
  Permanent: boolean;
}

interface attributeDataType {
  Username: string;
  UserPoolId: string | undefined;
  UserAttributes: AttributeListType;
}

export { poolDataType, passwordDataType, attributeDataType };
