
const enums = () => {

  const DefaultStatusType = Object.freeze({
    nothing: 0,
    active: 1,
    inactive: 2,
    deleted: 3,
  });

  const ContactOrderType = Object.freeze({
    nothing: 0,
    firstName: 1,
    lastName: 2,
    updated: 3,
    firstNameDesc: 4,
    lastNameDesc: 5,
    updatedDesc: 6,
  });

  const NacecodeOrderType = Object.freeze({
    nothing: 0,
    sector: 1,
    description: 2,
    updated: 3,
    sectorDesc: 4,
    descriptionDesc: 5,
    updatedDesc: 6
  });
  
  const OrganizationStatusType = Object.freeze({
    nothing: 0,
    new: 1,
    approved: 2,
    active: 3,
    inactive: 4,
    deleted: 5,
  });

  const StandardOrderType = Object.freeze({
    nothing: 0,
    name: 1,
    status: 2,
    update: 3,
    nameDesc: 4,
    statusDesc: 5,
    updateDesc: 6,
  });

  const SiteOrderType = Object.freeze({
    nothing: 0,
    description: 1,
    order: 2,
    status: 3,
    updated: 4,
    descriptionDesc: 5,
    orderDesc: 6,
    statusDesc: 7,
    updatedDesc: 8,
  });

  return {
    DefaultStatusType,

    ContactOrderType,
    NacecodeOrderType,
    OrganizationStatusType,
    SiteOrderType,
    StandardOrderType,
  }
};

export default enums;