
const licenseData = require('../../licenseData');

const createLicense = (knex, license) => {
  return knex('licenses').insert({
    licensee_name: license.licensee_name,
    doing_business_as: license.doing_business_as,
    license_type: license.license_type,
    issue_date: license.issue_data,
    license_number: license.license_number,
    street_address: license.street_address,
    city: license.city,
    state: license.state,
    zip: license.zip
  }, 'id')
  .then(licenseId => {
    let checkPromises = [];

    license.complianceChecks.forEach(check => {
      checkPromises.push(
        createCheck(knex, {
          date: check.date,
          pass: check.pass,
          agency: check.agency,
          license_id: licenseId[0]
        })
      )
    });
  
    return Promise.all(checkPromises)
  })
};

const createCheck = (knex, check) => {
  return knex('checks').insert(check);
};

exports.seed = (knex) => {
  return knex('checks').del()
    .then(() => knex('licenses').del())
    .then(() => {
      let licensePromises = [];

      licenseData.forEach(license => {
        licensePromises.push(createLicense(knex, license));
      });

      return Promise.all(licensePromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
