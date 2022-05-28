const getRecipientEmail=(users, userLoggedin)=>users?.filter((item)=>item !==userLoggedin?.email)[0]

export default getRecipientEmail