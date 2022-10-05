"use strict";

import { AttributeListType } from "aws-sdk/clients/cognitoidentityserviceprovider";

interface poolDataType {
  UserPoolId: string;
  Username: string;
  DesiredDeliveryMediums: string[];
  UserAttributes: AttributeListType;
}

interface passwordDataType {
  Password: string;
  UserPoolId: string;
  Username: string;
  Permanent: boolean;
}

interface attributeDataType {
  Username: string;
  UserPoolId: string;
  UserAttributes: AttributeListType;
}

export { poolDataType, passwordDataType, attributeDataType };
