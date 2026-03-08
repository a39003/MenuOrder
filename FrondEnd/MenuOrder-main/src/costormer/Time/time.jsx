export function convertToTime(isoString) {
    // Tạo đối tượng Date từ chuỗi thời gian ISO
    const date = new Date(isoString);
  
    // Lấy giờ, phút, giây từ đối tượng Date
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Lấy ngày, tháng, năm từ đối tượng Date
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = date.getFullYear();
  
    // Định dạng lại giờ, phút, giây để có định dạng HH:MM:SS
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
    // Định dạng lại ngày, tháng, năm để có định dạng DD/MM/YYYY
    const formattedDate = `${String(day).padStart(2, "0")}/${String(
      month
    ).padStart(2, "0")}/${year}`;
  
    // Ghép thời gian và ngày lại
    const fullDateTime = `${formattedTime} ${formattedDate}`;
  
    return fullDateTime;
  }
  