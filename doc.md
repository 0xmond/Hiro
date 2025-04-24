# **Authentication & Registration Schema**

## **1. Employee & Job Seeker Registration Schema**

| Field     | Type     | Required | Description                                     |
| --------- | -------- | -------- | ----------------------------------------------- |
| username  | `string` | Yes      | The unique username for the employee.           |
| email     | `string` | Yes      | Must be a valid email format.                   |
| phone     | `string` | Yes      | Must match Egyptian mobile or landline formats. |
| password  | `string` | Yes      | Minimum of 8 characters.                        |
| firstName | `string` | Yes      | At least 2 characters long.                     |
| lastName  | `string` | Yes      | At least 2 characters long.                     |
| dob       | `date`   | Yes      | Date of birth of the user.                      |
| gender    | `string` | Yes      | Must be one of the values from `Genders` enum.  |

---

## **2. Company Registration Schema**

| Field       | Type     | Required | Description                                     |
| ----------- | -------- | -------- | ----------------------------------------------- |
| username    | `string` | Yes      | The unique username for the company.            |
| email       | `string` | Yes      | Must be a valid email format.                   |
| phone       | `string` | Yes      | Must match Egyptian mobile or landline formats. |
| password    | `string` | Yes      | Minimum of 8 characters.                        |
| companyName | `string` | No       | At least 2 characters long.                     |
| address     | `string` | No       | The physical address of the company.            |

---

## **3. Login Schema**

| Field    | Type     | Required | Description                                                          |
| -------- | -------- | -------- | -------------------------------------------------------------------- |
| email    | `string` | No       | Must be a valid email format (required if username is not provided). |
| username | `string` | No       | Required if email is not provided.                                   |
| password | `string` | Yes      | Minimum of 8 characters.                                             |

**Note:** Either `email` or `username` is required.

---

## **4. Resend Confirmation Email Schema**

| Field | Type     | Required | Description                   |
| ----- | -------- | -------- | ----------------------------- |
| email | `string` | Yes      | Must be a valid email format. |

---

## **5. Request Password Reset Schema**

| Field | Type     | Required | Description                   |
| ----- | -------- | -------- | ----------------------------- |
| email | `string` | Yes      | Must be a valid email format. |

---

## **6. Password Reset Schema**

| Field       | Type     | Required | Description                                |
| ----------- | -------- | -------- | ------------------------------------------ |
| token       | `string` | Yes      | Token received for resetting the password. |
| newPassword | `string` | Yes      | Minimum of 8 characters.                   |

---

<br>
<br>

# **Profile Schema**

## **1. Get Profile Schema**

| Field | Type     | Required | Description                                  |
| ----- | -------- | -------- | -------------------------------------------- |
| id    | `string` | No       | Optional user ID. Must be a valid ID format. |

---

## **2. Update Profile Schema**

This schema is dynamic based on the `key` parameter, which determines whether the update is for an **Employee** or a **Company**.

### **Common Fields (Available for Both Employee & Company)**

| Field    | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| username | `string` | No       | Optional username.                               |
| email    | `string` | No       | Must be a valid email format.                    |
| phone    | `string` | No       | Must follow Egyptian mobile/landline formats.    |
| address  | `string` | No       | Must be at least 10 characters long.             |
| website  | `string` | No       | Must be a valid URL (e.g., https://example.com). |

### **Fields Only for Employees**

| Field                  | Type     | Required | Description                                                     |
| ---------------------- | -------- | -------- | --------------------------------------------------------------- |
| firstName              | `string` | No       | Minimum of 2 characters.                                        |
| lastName               | `string` | No       | Minimum of 2 characters.                                        |
| dob                    | `date`   | No       | Date of birth.                                                  |
| gender                 | `string` | No       | Must be one of: `Male`, `Female`, `Other` (based on `Genders`). |
| education              | `string` | No       | Optional education details.                                     |
| experience             | `object` | No       | Contains details about education degrees.                       |
| experience.degree      | `string` | Yes      | Must be one of the `EducationDegrees` values.                   |
| experience.institution | `string` | Yes      | Name of the institution.                                        |
| experience.location    | `string` | Yes      | Location of the institution.                                    |
| jobTitle               | `string` | No       | Must be one of the `JobCategory` values.                        |
| github                 | `string` | No       | Must be a valid GitHub profile URL.                             |
| twitter                | `string` | No       | Must be a valid Twitter (X) profile URL.                        |

### **Fields Only for Companies**

| Field        | Type     | Required | Description                                      |
| ------------ | -------- | -------- | ------------------------------------------------ |
| companyName  | `string` | No       | Minimum of 2 characters.                         |
| aboutCompany | `string` | No       | Minimum of 30 characters describing the company. |

---

## **3. Update Skills Schema**

| Field  | Type    | Required | Description                                       |
| ------ | ------- | -------- | ------------------------------------------------- |
| skills | `array` | Yes      | An array of skill names (strings), each required. |

---

<br>
<br>

# **Job Post Schema**

## **1. Create Job Post Schema**

| Field               | Type     | Required | Description                                |
| ------------------- | -------- | -------- | ------------------------------------------ |
| jobCategory         | `string` | Yes      | Must be one of the `JobCategory` values.   |
| jobTitle            | `string` | Yes      | Job title.                                 |
| jobDescription      | `string` | Yes      | Must be at least 30 characters long.       |
| requiredSkills      | `array`  | Yes      | List of required skills (strings).         |
| location            | `string` | No       | Job location.                              |
| country             | `string` | Yes      | Must be one of the `ArabCountries` values. |
| city                | `string` | Yes      | Must be one of the `Governorates` values.  |
| salary              | `number` | No       | Salary amount.                             |
| jobPeriod           | `string` | Yes      | Must be one of the `JobPeriod` values.     |
| jobType             | `string` | No       | Must be one of the `JobType` values.       |
| experience          | `string` | Yes      | Must be one of the `Experiences` values.   |
| applicationDeadline | `date`   | Yes      | Application deadline date.                 |

---

## **2. Delete Job Post Schema**

| Field | Type     | Required | Description                |
| ----- | -------- | -------- | -------------------------- |
| id    | `string` | Yes      | Must be a valid ID format. |

---

## **3. Update Job Post Schema**

| Field               | Type     | Required | Description                                |
| ------------------- | -------- | -------- | ------------------------------------------ |
| id                  | `string` | Yes      | Must be a valid ID format.                 |
| jobCategory         | `string` | No       | Must be one of the `JobCategory` values.   |
| jobTitle            | `string` | No       | Job title.                                 |
| jobDescription      | `string` | No       | Must be at least 30 characters long.       |
| requiredSkills      | `array`  | No       | List of required skills (strings).         |
| location            | `string` | No       | Job location.                              |
| country             | `string` | No       | Must be one of the `ArabCountries` values. |
| city                | `string` | No       | Must be one of the `Governorates` values.  |
| salary              | `number` | No       | Salary amount.                             |
| jobPeriod           | `string` | No       | Must be one of the `JobPeriod` values.     |
| jobType             | `string` | No       | Must be one of the `JobType` values.       |
| experience          | `string` | No       | Must be one of the `Experiences` values.   |
| applicationDeadline | `date`   | No       | Application deadline date.                 |

---

## **4. Get Job Post Schema**

| Field | Type     | Required | Description           |
| ----- | -------- | -------- | --------------------- |
| id    | `string` | No       | Optional job post ID. |

---

## **5. Job Search Schema**

| Field      | Type     | Required | Description                                             |
| ---------- | -------- | -------- | ------------------------------------------------------- |
| search     | `string` | No       | Search query string.                                    |
| location   | `string` | No       | Job location.                                           |
| jobPeriod  | `array`  | No       | List of job periods (must be from `JobPeriod`).         |
| jobType    | `array`  | No       | List of job types (must be from `JobType`).             |
| experience | `array`  | No       | List of experience levels (must be from `Experiences`). |
| minSalary  | `number` | Yes      | Minimum salary, must be at least `1`.                   |
| maxSalary  | `number` | Yes      | Maximum salary, must be greater than `minSalary`.       |
| size       | `number` | Yes      | Page size, must be less than `20`.                      |
| page       | `number` | Yes      | Page number, must be less than `100`.                   |

---

## **6. Archive Job Post Schema**

| Field | Type     | Required | Description                |
| ----- | -------- | -------- | -------------------------- |
| id    | `string` | Yes      | Must be a valid ID format. |

---

<br>
<br>

# **Job Application Schema**

## **1. Create Job Application Schema**

| Field       | Type     | Required | Description                          |
| ----------- | -------- | -------- | ------------------------------------ |
| postId      | `string` | Yes      | Must be a valid job post ID.         |
| attachment  | `object` | No       | Optional file attachment details.    |
| coverLetter | `string` | Yes      | Must be at least 30 characters long. |

---

## **2. Check Application Status Schema**

| Field  | Type     | Required | Description                     |
| ------ | -------- | -------- | ------------------------------- |
| id     | `string` | Yes      | Must be a valid application ID. |
| postId | `string` | Yes      | Must be a valid job post ID.    |

---

## **3. Update Application Status Schema**

| Field   | Type      | Required | Description                                                      |
| ------- | --------- | -------- | ---------------------------------------------------------------- |
| respond | `boolean` | Yes      | Indicates whether the employer has responded to the application. |
| id      | `string`  | Yes      | Must be a valid application ID.                                  |
| postId  | `string`  | Yes      | Must be a valid job post ID.                                     |

---

## **4. Get Job Applications Schema**

| Field  | Type     | Required | Description                  |
| ------ | -------- | -------- | ---------------------------- |
| postId | `string` | Yes      | Must be a valid job post ID. |

---

### Documented by:

- Mostafa Mahmoud
