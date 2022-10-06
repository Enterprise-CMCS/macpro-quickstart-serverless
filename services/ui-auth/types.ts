"use strict";

import { AttributeListType } from "aws-sdk/clients/cognitoidentityserviceprovider";

interface poolDataType {
  UserPoolId: any;
  Username: string;
  DesiredDeliveryMediums: string[];
  UserAttributes: AttributeListType;
}
// help build again
interface passwordDataType {
  Password: any;
  UserPoolId: any;
  Username: string;
  Permanent: boolean;
}

interface attributeDataType {
  Username: string;
  UserPoolId: any;
  UserAttributes: AttributeListType;
}

export { poolDataType, passwordDataType, attributeDataType };
