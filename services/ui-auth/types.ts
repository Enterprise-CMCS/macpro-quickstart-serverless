"use strict";

interface poolDataType {
  UserPoolId: string | undefined;
  Username: string;
  DesiredDeliveryMediums: string[];
  UserAttributes: object[];
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
  UserAttributes: object[];
}

export { poolDataType, passwordDataType, attributeDataType };
