import faker from 'faker'
import moment from 'moment'
import random from 'random'

faker.locale = "en_US";

const ANSWER_TEMPLATES = [
  'Yes, I do',
  'Sure',
  'I Choose not to answer'
]

const RISK_LEVELS = [
  'critical',
  'high',
  'medium',
  'low',
  'informational'
]

const random_risk_level = () => {
  const risk_idx = random.int(0, 4)
  return RISK_LEVELS[risk_idx]
}

const ramdomOrg = (limit) => {
  const orgs = ['/']
  Array.apply(null, Array(limit)).map(() => {
    orgs.push(`/${faker.random.word()}`)
  })

  return orgs
}

const isUniqueEmail = (email, items) => {
  const filtered = items.filter(item => item.email == email)

  return filtered && filtered.length == 0
}

const getDateArray = (start, end) => {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        arr.push(moment(dt).format('YYYY-MM-DD'));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}


export const generateGeneralUsers = ({userCnt, company_id}) => {
  // org_unit_path
  const limit = Math.max(Math.min(parseInt(userCnt/10), 10), 2)
  const orgs = ramdomOrg(limit)

  const users = []

  Array.apply(null, Array(userCnt)).map((item, id) => {
    const firstname = faker.name.firstName()
    const lastname = faker.name.lastName()
    const fullName = `${firstname} ${lastname}`
    const preferred_name = ''
    const job_title = faker.name.jobTitle()
    const department = faker.name.jobType()
    const dob = moment(faker.date.between(50, 90)).format('MM/DD/YYYY')
    const email = faker.internet.email(firstname, lastname).split('@')[0] + '@'+ company_id
    const username = faker.internet.userName(firstname, lastname)
    const location = `${faker.address.city()} ${faker.address.stateAbbr()}`
    const agreedToTerms = Number(faker.random.boolean())
    const isEnforcedIn2Sv = Number(faker.random.boolean())
    const has_2fa = Number(faker.random.boolean())
    const suspended = Number(faker.random.boolean())
    const org_idx = random.int(0, limit-1)
    const lastLoginTime = faker.date.recent()
    const orgUnitPath = orgs[org_idx]
    const name = {
      familyName: lastname,
      fullName,
      givenName: firstname 
    }

    // sometimes email has some duplication
    if (!isUniqueEmail(email, users)) {
      return
    }
    users.push({
      id,
      email,
      primaryEmail: email,
      fullName,
      name,
      dob,
      job_title,
      department,
      location,
      username,
      agreedToTerms,
      isEnforcedIn2Sv,
      orgUnitPath,
      suspended,
      lastLoginTime,
      has_2fa,
      company_id
    })
  })

  return users
}

export const generateUsers = ({general_bamboo}) => {
  return general_bamboo.map(user => {
    
    return {
      id: user.id,
      firstname_lastname: user.fullName,
      email: user.email,
      company: '',
      gsuite_2fa: user.isEnforcedIn2Sv,
      gsuite_admin: '',
      location: user.orgUnitPath,
      email_not_active: user.suspended,
      department: user.department,
      job_title: user.job_title,
      user_type: '',
      risk_level: random_risk_level(),
      observations: '',
      privileged_account: Number(faker.random.boolean()),
      jamf_installed: Number(faker.random.boolean()),
      opt_out: Number(faker.random.boolean()),
      notes: '',
      run_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      company_id: user.company_id
    }
  })
}

export const generateGoogleGroups = ({groupCnt, company_id, general_bamboo}) => {
  const groups = []

  Array.apply(null, Array(groupCnt)).map((item, id) => {
    const name = faker.company.bs()
    const description = faker.company.catchPhrase()
    const email = `${name.replace(/ /g, '-')}@${company_id}`
    const aliases = ''
    let directMembersCount = random.uniformInt(1, Math.min(200, general_bamboo.length))()
    let member_emails = []
    Array.apply(null, Array(directMembersCount)).map(() => {
      const idx = random.uniformInt(1, general_bamboo.length-1)()
      if (isUniqueEmail(general_bamboo[idx].email, member_emails)) {
        member_emails.push(general_bamboo[idx].email)
      }
    })
    directMembersCount = member_emails.length

    // sometimes email has some duplication
    if (!isUniqueEmail(email, groups)) {
      return
    }

    // member_emails = member_emails.join(',')
    groups.push({
      id,
      name,
      description,
      email,
      aliases,
      directMembersCount,
      member_emails,
      company_id,
      run_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    })

    return groups
  })

  return groups
}

export const generateGroups = ({google_groups}) => {
  return google_groups.map(group => {
    return {
      id:group.id,
      name: group.name,
      description: group.description,
      email: group.email,
      aliases:group.aliases,
      members: group.member_emails.join(','),
      members_count: group.directMembersCount,
      company_id: group.company_id,
      run_at: group.run_at,
      kind: '',
      whoCanAdd: '',
      whoCanJoin: '',
      whoCanViewMembership: '',
      whoCanViewGroup: '',
      whoCanInvite: '',
      allowExternalMembers: '',
      whoCanPostMessage: '',
      allowWebPosting: '',
      primaryLanguage: '',
      maxMessageBytes: '',
      isArchived: '',
      archiveOnly: '',
      messageModerationLevel: '',
      spamModerationLevel: '',
      replyTo: '',
      customReplyTo: '',
      includeCustomFooter: '',
      customFooterText: '',
      sendMessageDenyNotification: '',
      defaultMessageDenyNotificationText: '',
      showInGroupDirectory: '',
      membersCanPostAsTheGroup: '',
      messageDisplayFont: '',
      includeInGlobalAddressList: '',
      whoCanLeaveGroup: '',
      whoCanContactOwner: '',
      whoCanAddReferences: '',
      whoCanAssignTopics: '',
      whoCanUnassignTopic: '',
      whoCanTakeTopics: '',
      whoCanMarkDuplicate: '',
      whoCanMarkNoResponseNeeded: '',
      whoCanMarkFavoriteReplyOnAnyTopic: '',
      whoCanMarkFavoriteReplyOnOwnTopic: '',
      whoCanUnmarkFavoriteReplyOnAnyTopic: '',
      whoCanEnterFreeFormTags: '',
      whoCanModifyTagsAndCategories: '',
      favoriteRepliesOnTop: '',
      whoCanApproveMembers: '',
      whoCanBanUsers: '',
      whoCanModifyMembers: '',
      whoCanApproveMessages: '',
      whoCanDeleteAnyPost: '',
      whoCanDeleteTopics: '',
      whoCanLockTopics: '',
      whoCanMoveTopicsIn: '',
      whoCanMoveTopicsOut: '',
      whoCanPostAnnouncements: '',
      whoCanHideAbuse: '',
      whoCanMakeTopicsSticky: '',
      whoCanModerateMembers: '',
      whoCanModerateContent: '',
      whoCanAssistContent: '',
      customRolesEnabledForSettingsToBeMerged: '',
      enableCollaborativeInbox: '',
      whoCanDiscoverGroup: '',
      allowGoogleCommunication: '',
    }
  })
}

export const generateCompanyApps = ({company_id, apps}) => {
  const company_applications = []
  const totalAppsCnt = random.uniformInt(10, parseInt(apps.length/2))()
  apps.map((app, id) =>{
    if (company_applications.length > totalAppsCnt) {
      return
    }
    if (!random.uniformBoolean()) {
      return
    }
    const department = faker.name.jobType()
    const Owner = ''
    const admin_user = ''
    const price = faker.finance.amount()
    const saml_enabled = Number(faker.random.boolean())
    const no_users = ''
    const other = ''
    const expiration_date = faker.date.between(2021, 2022)
    company_applications.push({
      id,
      company_id,
      application_id: app.id,
      name: app.application_name,
      department,
      Owner,
      admin_user,
      price,
      saml_enabled,
      no_users,
      other,
      expiration_date,
      users_table_name: app.users_table_name
    })
  })

  return company_applications
}

export const generateSecurityAnswers = ({company_id, questions, startDate, endDate}) => {
  const answers = []

  const totalQuestionsCnt = random.uniformInt(10, parseInt(questions.length/3))()
  const run_atArray = getDateArray(new Date(startDate), new Date(endDate))
  let id = 0
  run_atArray.map( (run_at) => {
    if (faker.random.boolean()) {
      questions.map((question) => {    
        id++

        // limit the # randomly
        if (answers.length > totalQuestionsCnt) {
          return
        }

        // skip the public data
        if (question.mapping) {
          return
        }
        if (!faker.random.boolean()) {
          return
        }
        const idx = random.int(0, ANSWER_TEMPLATES.length-1)
        const Answer = ANSWER_TEMPLATES[idx]
        const link = ''
        const tag = ''
        const risk_level = random_risk_level()
        const informational_risk = Number(faker.random.boolean())
        const Confidentiality = Number(faker.random.boolean())
        const Integrity = Number(faker.random.boolean())
        const availability = Number(faker.random.boolean())
        const T1 = Number(faker.random.boolean())
        const T2 = Number(faker.random.boolean())
        const T3 = Number(faker.random.boolean())
        const T4 = Number(faker.random.boolean())
        const T5 = Number(faker.random.boolean())
        const T6 = Number(faker.random.boolean())
        const T7 = Number(faker.random.boolean())
        const T8 = Number(faker.random.boolean())
        const T9 = Number(faker.random.boolean())
        const T10 = Number(faker.random.boolean())
        const T11 = Number(faker.random.boolean())
        const Notes = ''
        answers.push({
          id,
          question_id: question.id,
          question: question.Question,
          Answer,
          Category: question.Category,
          description: question.Description,
          link,
          tag,
          risk_level,
          Confidentiality,
          Integrity,
          availability,
          T1,
          T2,
          T3,
          T4,
          T5,
          T6,
          T7,
          T8,
          T9,
          T10,
          T11,
          Notes,
          company_id,
          run_at
        })
      })
    }
  })
  return answers
}

export const generateDevices = ({company_id, users, devices}) => {
  const users_cnt = parseInt(users.length/2)
  const gsuite_devices = []
  while (true) {
    const device_idx = random.int(0, devices.length-1)
    const random_device = devices[device_idx]

    const user_idx = random.int(0, users.length-1)
    const random_user = users[user_idx]
    gsuite_devices.push({
      kind: random_device.kind,
      resourceId: random_device.resourceId,
      deviceId: random_device.deviceId,
      name: random_user.firstname_lastname,
      email: random_user.email,
      model: random_device.model,
      os: random_device.os,
      type: random_device.type,
      status: random_device.status,
      hardwareId: random_device.hardwareId,
      firstsync: random_device.firstsync,
      lastsync: random_device.lastsync,
      useragent: random_device.useragent,
      run_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      company_id: company_id
    })

    if (gsuite_devices.length > users_cnt) {
      break
    }
  }

  return gsuite_devices
}

export const generateData = ({
    userCnt,
    groupCnt,
    company_id,
    apps,
    questions,
    devices,
    startDate,
    endDate
  }) => {
  userCnt = Number(userCnt)
  groupCnt = Number(groupCnt)
  
  const general_bamboo = generateGeneralUsers({userCnt, company_id})
  const users = generateUsers({general_bamboo})
  const google_groups = generateGoogleGroups({groupCnt, company_id, general_bamboo})
  const groups = generateGroups({google_groups})
  const company_applications = generateCompanyApps({company_id, apps})
  const security_answers = generateSecurityAnswers({company_id, questions, startDate, endDate})
  const gsuite_devices = generateDevices({company_id, users, devices})

  return {
    users,
    groups,
    general_bamboo,
    google_groups,
    company_applications,
    security_answers,
    gsuite_devices
  }
}