let reservations = [
  {
    reservationCode: "HTL-001",
    guestName: "Phạm Quốc Bảo",
    roomType: "Phòng Đơn Tiêu Chuẩn",
    nightCount: 2,
    pricePerNight: 500000,
    totalAmount: 1100000
  },
  {
    reservationCode: "HTL-002",
    guestName: "Đỗ Thu Trang",
    roomType: "Phòng Đôi Hướng Biển",
    nightCount: 5,
    pricePerNight: 800000,
    totalAmount: 3740000
  },
  {
    reservationCode: "HTL-003",
    guestName: "Vũ Hoàng Long",
    roomType: "Phòng Gia Đình Cao Cấp",
    nightCount: 7,
    pricePerNight: 1200000,
    totalAmount: 7854000
  }
];

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

function formatText(text) {
  if (!text) {
    return "";
  }
  let trimmed = text.trim();
  if (trimmed === "") {
    return "";
  }
  let words = trimmed.split(" ");
  let capitalizedWords = words.map(function(word) {
    if (word === "") {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
}

function findReservationIndex(code) {
  if (!code) {
    return -1;
  }
  let targetCode = code.trim().toUpperCase();
  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].reservationCode === targetCode) {
      return i;
    }
  }
  return -1;
}

function validateReservationCode(code) {
  if (code === null) {
    return "Hủy thao tác";
  }
  if (code.trim() === "") {
    return "Lỗi: Chưa nhập mã đặt phòng";
  }
  let upperCode = code.trim().toUpperCase();
  if (upperCode.length < 6) {
    return "Lỗi: Độ dài nhỏ hơn 6 ký tự";
  }
  if (!upperCode.startsWith("HTL-")) {
    return "Lỗi: Sai tiền tố \"HTL-\"";
  }
  for (let i = 0; i < upperCode.length; i++) {
    if (upperCode.charAt(i) === " ") {
      return "Lỗi: Chứa khoảng trắng";
    }
  }
  if (findReservationIndex(upperCode) !== -1) {
    return "Lỗi: Mã đặt phòng đã tồn tại";
  }
  return "";
}

function inputPositiveInteger(message) {
  while (true) {
    let input = prompt(message);
    if (input === null) {
      return null;
    }
    let trimmed = input.trim();
    if (trimmed === "") {
      continue;
    }
    let num = Number(trimmed);
    if (Number.isInteger(num) && num > 0) {
      return num;
    }
  }
}

function calculateTotal(nightCount, pricePerNight) {
  let baseCost = nightCount * pricePerNight;
  let discount = 0;
  if (nightCount >= 5) {
    discount = Math.round(baseCost * 0.15);
  }
  let serviceFee = Math.round((baseCost - discount) * 0.10);
  let totalAmount = baseCost - discount + serviceFee;
  return {
    baseCost: baseCost,
    discount: discount,
    serviceFee: serviceFee,
    totalAmount: totalAmount
  };
}

function displayReservations(list) {
  if (!list || list.length === 0) {
    console.log("Danh sách đơn đặt phòng trống");
    return;
  }
  let totalRevenue = 0;
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    totalRevenue += item.totalAmount;
    console.log(
      (i + 1) + ". " + item.reservationCode + " - " + item.guestName + " - " + item.roomType + "\n   Số đêm: " + item.nightCount + " | Giá: " + item.pricePerNight + " | Tổng TT: " + item.totalAmount
    );
  }
  console.log("Tổng: " + list.length + " đơn đặt phòng – Doanh thu: " + totalRevenue);
}

function handleDisplayReservations() {
  displayReservations(reservations);
}

function handleAddReservation() {
  let rawCode = prompt("Nhập mã đặt phòng mới:");
  if (rawCode === null) {
    console.log("Đã hủy thao tác thêm.");
    return;
  }
  let codeError = validateReservationCode(rawCode);
  if (codeError !== "") {
    alert(codeError);
    return;
  }
  let reservationCode = rawCode.trim().toUpperCase();

  let rawName = prompt("Nhập tên khách hàng:");
  if (rawName === null) {
    console.log("Đã hủy thao tác thêm.");
    return;
  }
  let guestName = formatText(rawName);
  while (guestName === "") {
    let retryName = prompt("Tên khách hàng không được để trống. Nhập lại tên khách hàng:");
    if (retryName === null) {
      console.log("Đã hủy thao tác thêm.");
      return;
    }
    guestName = formatText(retryName);
  }

  let rawRoom = prompt("Nhập loại phòng:");
  if (rawRoom === null) {
    console.log("Đã hủy thao tác thêm.");
    return;
  }
  let roomType = formatText(rawRoom);
  while (roomType === "") {
    let retryRoom = prompt("Loại phòng không được để trống. Nhập lại loại phòng:");
    if (retryRoom === null) {
      console.log("Đã hủy thao tác thêm.");
      return;
    }
    roomType = formatText(retryRoom);
  }

  let nightCount = inputPositiveInteger("Nhập số đêm lưu trú (> 0):");
  if (nightCount === null) {
    console.log("Đã hủy thao tác thêm.");
    return;
  }

  let pricePerNight = inputPositiveInteger("Nhập giá mỗi đêm (> 0):");
  if (pricePerNight === null) {
    console.log("Đã hủy thao tác thêm.");
    return;
  }

  let calc = calculateTotal(nightCount, pricePerNight);
  let newReservation = {
    reservationCode: reservationCode,
    guestName: guestName,
    roomType: roomType,
    nightCount: nightCount,
    pricePerNight: pricePerNight,
    totalAmount: calc.totalAmount
  };

  reservations.push(newReservation);
  console.log("Thêm đơn đặt phòng thành công!");
  console.log("Mã đặt phòng: " + newReservation.reservationCode);
  console.log("Khách hàng: " + newReservation.guestName);
  console.log("Loại phòng: " + newReservation.roomType);
  console.log("Số đêm: " + newReservation.nightCount);
  console.log("Giá mỗi đêm: " + newReservation.pricePerNight);
  console.log("Chi phí cơ sở: " + calc.baseCost);
  console.log("Giảm giá: " + calc.discount);
  console.log("Phí dịch vụ: " + calc.serviceFee);
  console.log("Tổng thanh toán: " + calc.totalAmount);
}

function handleUpdateReservation() {
  let rawCode = prompt("Nhập mã đặt phòng cần cập nhật:");
  if (rawCode === null) {
    return;
  }
  let code = rawCode.trim().toUpperCase();
  let index = findReservationIndex(code);
  if (index === -1) {
    console.log("Không tìm thấy đơn đặt phòng có mã " + code);
    return;
  }

  let currentItem = reservations[index];
  let oldTotal = currentItem.totalAmount;

  let rawNight = prompt("Nhập số đêm mới (Cancel để giữ nguyên):", currentItem.nightCount);
  let nightCount = currentItem.nightCount;
  if (rawNight !== null && rawNight.trim() !== "") {
    let num = Number(rawNight.trim());
    if (Number.isInteger(num) && num > 0) {
      nightCount = num;
    }
  }

  let rawPrice = prompt("Nhập giá mỗi đêm mới (Cancel để giữ nguyên):", currentItem.pricePerNight);
  let pricePerNight = currentItem.pricePerNight;
  if (rawPrice !== null && rawPrice.trim() !== "") {
    let num = Number(rawPrice.trim());
    if (Number.isInteger(num) && num > 0) {
      pricePerNight = num;
    }
  }

  let calc = calculateTotal(nightCount, pricePerNight);
  currentItem.nightCount = nightCount;
  currentItem.pricePerNight = pricePerNight;
  currentItem.totalAmount = calc.totalAmount;

  console.log("Cập nhật thành công");
  console.log("Tổng thanh toán cũ: " + oldTotal);
  console.log("Tổng thanh toán mới: " + currentItem.totalAmount);
}

function handleDeleteReservation() {
  let rawCode = prompt("Nhập mã đặt phòng cần xóa:");
  if (rawCode === null) {
    console.log("Đã hủy thao tác xóa, còn " + reservations.length + " đơn");
    return;
  }
  let code = rawCode.trim().toUpperCase();
  let index = findReservationIndex(code);
  if (index === -1) {
    console.log("Không tìm thấy đơn đặt phòng có mã " + code);
    return;
  }

  let confirmDelete = prompt("Xác nhận xóa đơn " + code + "? Nhập 'Y' hoặc 'y' để đồng ý:");
  if (confirmDelete === null || (confirmDelete.trim() !== "Y" && confirmDelete.trim() !== "y")) {
    console.log("Đã hủy thao tác xóa, còn " + reservations.length + " đơn");
    return;
  }

  reservations.splice(index, 1);
  console.log("Xóa thành công, còn " + reservations.length + " đơn");
}

function handleSearchReservation() {
  let rawKey = prompt("Nhập từ khóa tìm kiếm loại phòng:");
  if (rawKey === null || rawKey.trim() === "") {
    console.log("Chưa nhập từ khóa tìm kiếm");
    return;
  }
  let keyword = rawKey.trim().toLowerCase();
  let matchedList = [];
  for (let i = 0; i < reservations.length; i++) {
    let roomLower = reservations[i].roomType.toLowerCase();
    if (roomLower.includes(keyword)) {
      matchedList.push(reservations[i]);
    }
  }

  if (matchedList.length === 0) {
    console.log("Không tìm thấy đơn đặt phòng phù hợp");
    return;
  }

  let codes = [];
  for (let i = 0; i < matchedList.length; i++) {
    codes.push(matchedList[i].reservationCode);
  }
  console.log("Số kết quả: " + matchedList.length);
  console.log("Mã đặt phòng tìm thấy: " + codes.join(", "));
}

function printSummaryReport() {
  if (reservations.length === 0) {
    console.log("Chưa có đơn đặt phòng nào");
    return;
  }
  let totalOrders = reservations.length;
  let totalRevenue = 0;
  let highestItem = reservations[0];

  for (let i = 0; i < reservations.length; i++) {
    totalRevenue += reservations[i].totalAmount;
    if (reservations[i].totalAmount > highestItem.totalAmount) {
      highestItem = reservations[i];
    }
  }
  let avgRevenue = Math.round(totalRevenue / totalOrders);

  console.log("==================================================");
  console.log("BÁO CÁO TỔNG KẾT ĐƠN ĐẶT PHÒNG");
  console.log("==================================================");
  console.log("Tổng số đơn đặt phòng                  : " + totalOrders);
  console.log("Tổng doanh thu                         : " + formatCurrency(totalRevenue));
  console.log("Doanh thu trung bình                   : " + formatCurrency(avgRevenue));
  console.log("Đơn cao nhất                           : " + highestItem.reservationCode + " - " + formatCurrency(highestItem.totalAmount));
  console.log("==================================================");
}

function displayMenu() {
  console.log("=====================================================");
  console.log("     HỆ THỐNG QUẢN LÝ ĐẶT PHÒNG SUNRISE HOTEL        ");
  console.log("=====================================================");
  console.log("1. Hiển thị danh sách đơn đặt phòng");
  console.log("2. Thêm đơn đặt phòng mới");
  console.log("3. Cập nhật đơn đặt phòng");
  console.log("4. Xóa đơn đặt phòng");
  console.log("5. Tìm kiếm đơn đặt phòng theo loại phòng");
  console.log("0. Thoát chương trình");
  console.log("=====================================================");
}

function main() {
  let isRunning = true;
  do {
    displayMenu();
    let rawChoice = prompt("Vui lòng nhập lựa chọn của bạn (0 - 5):");
    if (rawChoice === null) {
      console.log("Cảm ơn bạn đã sử dụng hệ thống. Tạm biệt!");
      printSummaryReport();
      break;
    }
    let trimmedChoice = rawChoice.trim();
    if (trimmedChoice === "") {
      console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
      continue;
    }
    let choice = Number(trimmedChoice);
    if (!Number.isInteger(choice)) {
      console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
      continue;
    }

    switch (choice) {
      case 1:
        handleDisplayReservations();
        break;
      case 2:
        handleAddReservation();
        break;
      case 3:
        handleUpdateReservation();
        break;
      case 4:
        handleDeleteReservation();
        break;
      case 5:
        handleSearchReservation();
        break;
      case 0:
        console.log("Cảm ơn bạn đã sử dụng hệ thống. Tạm biệt!");
        printSummaryReport();
        isRunning = false;
        break;
      default:
        console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
        break;
    }
  } while (isRunning);
}

main();