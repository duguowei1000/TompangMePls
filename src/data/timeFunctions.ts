function roundToNearest30(date = new Date()) {
    console.log("datehere", date)
    const minutes = 30;
    const ms = 1000 * 60 * minutes;
  
    // 👇️ replace Math.round with Math.ceil to always round UP
    return new Date(Math.round(date.getTime() / ms) * ms);
  }


export default roundToNearest30
export {}