
const circulationLogs = [
    {
        logId: "LOG-1001",
        studentCode: "SV2024-01",
        bookIsbn: "978-0131103627",
        status: "BORROWING",
        borrowDays: 7,
        maxAllowedDays: 14,
        fineAmount: 0
    },
    {
        logId: "LOG-1002",
        studentCode: "SV2024-02",
        bookIsbn: "978-0321573513",
        status: "BORROWING",
        borrowDays: 20,
        maxAllowedDays: 14,
        fineAmount: 0
    },
    {
        logId: "LOG-1000",
        studentCode: "SV2023-99",
        bookIsbn: "978-0201633610",
        status: "RETURNED",
        borrowDays: 10,
        maxAllowedDays: 14,
        fineAmount: 0,
        daysSinceCompleted: 35
    }
];

/**
 * @param {string} title - Tiêu đề của báo cáo
 */
function printCirculationReport(title) {
    console.log(`\n==========================================================================================`);
    console.log(`  BÁO CÁO NHẬT KÝ LƯU CHUYỂN & MƯỢN TRẢ: ${title.toUpperCase()}`);
    console.log(`==========================================================================================`);
    console.table(circulationLogs);
}

printCirculationReport("Nhật ký ban đầu");

console.log("\n[THAO TÁC 1] Sinh viên SV2024-03 thực hiện mượn sách mới...");

const newBorrowLog = {
    logId: `LOG-${Date.now().toString().slice(-4)}`,
    studentCode: "SV2024-03",
    bookIsbn: "978-0596517748",
    status: "BORROWING",
    borrowDays: 0,
    maxAllowedDays: 14,
    fineAmount: 0
};

circulationLogs.push(newBorrowLog);
console.log(`=> Đã ghi nhận bản ghi mượn sách mới thành công (${newBorrowLog.logId}).`);
printCirculationReport("Sau khi thêm giao dịch mượn mới");

console.log("\n[THAO TÁC 2] Xử lý trả sách và tính phí phạt...");


const lateLogId = "LOG-1002";
let lateIndex = circulationLogs.findIndex(log => log.logId === lateLogId);

if (lateIndex !== -1) {
    const log = circulationLogs[lateIndex];
    log.status = "RETURNED";
    log.daysSinceCompleted = 0;

    if (log.borrowDays > log.maxAllowedDays) {
        const overdueDays = log.borrowDays - log.maxAllowedDays;
        log.fineAmount = overdueDays * 5000;
        console.log(`=> Nhật ký ${lateLogId}: Trả trễ ${overdueDays} ngày. Phí phạt: ${log.fineAmount.toLocaleString("vi-VN")} VNĐ.`);
    } else {
        console.log(`=> Nhật ký ${lateLogId}: Trả đúng hạn. Không có phí phạt.`);
    }
}

const lostLogId = "LOG-1001";
let lostIndex = circulationLogs.findIndex(log => log.logId === lostLogId);

if (lostIndex !== -1) {
    const log = circulationLogs[lostIndex];
    log.status = "LOST";
    log.fineAmount = 200000;
    log.daysSinceCompleted = 0;
    console.log(`=> Nhật ký ${lostLogId}: Báo MẤT SÁCH. Phí phạt đền bù: ${log.fineAmount.toLocaleString("vi-VN")} VNĐ.`);
}

printCirculationReport("Sau khi xử lý trả sách & tính phạt");

console.log("\n[THAO TÁC 3] Dọn dẹp nhật ký đã hoàn tất quá 30 ngày để tối ưu bộ nhớ...");

for (let i = circulationLogs.length - 1; i >= 0; i--) {
    const log = circulationLogs[i];
    if ((log.status === "RETURNED" || log.status === "LOST") && log.daysSinceCompleted > 30) {
        const deletedLog = circulationLogs.splice(i, 1);
        console.log(`=> Đã xóa nhật ký đã giải quyết quá hạn lưu trữ: ${deletedLog[0].logId}`);
    }
}

printCirculationReport("Sau khi dọn dẹp nhật ký cũ");

let currentlyBorrowingCount = 0;
let totalFineCollected = 0;

for (const log of circulationLogs) {
    if (log.status === "BORROWING") {
        currentlyBorrowingCount++;
    }
    totalFineCollected += log.fineAmount;
}

console.log("\n+--------------------------------------------------------------------+");
console.log("|             BÁO CÁO TỔNG KẾT BÀN LƯU CHUYỂN CUỐI NGÀY              |");
console.log("+--------------------------------------------------------------------+");
console.log(`| Tổng số giao dịch còn trong nhật ký: ${circulationLogs.length.toString().padEnd(29)}|`);
console.log(`| Số lượt sách đang được mượn:         ${currentlyBorrowingCount.toString().padEnd(29)}|`);
console.log(`| Tổng tiền phạt thu được trong ngày:  ${totalFineCollected.toLocaleString("vi-VN")} VNĐ`.padEnd(69) + "|");
console.log("+--------------------------------------------------------------------+\n");