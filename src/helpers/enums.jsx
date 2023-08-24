
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
    OrganizationStatusType,
    SiteOrderType,
    StandardOrderType,
  }
};

export default enums;