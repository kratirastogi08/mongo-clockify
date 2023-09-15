const validateEmail=(email)=>{
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email)
}
const validatePhone=(phone)=>{
    const regex=/^\d{10}$/
    return regex.test(phone)
}
module.exports={
    validateEmail,
    validatePhone
}