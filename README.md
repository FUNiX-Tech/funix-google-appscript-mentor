# AppScript cho checklist mentor đảm bảo chất lượng bài giảng

---

## Tổng quan

Mục địch: tạo time-driven trigger (trigger chạy theo lịch trình thời gian) chạy function `updateSummaryFile`.

Function `updateSummaryFile` có tác dụng đọc tất cả file trong folder `MENTOR_FOLDER` rồi tổng hợp hết vào file tổng hợp `SUMMARY_SPREADSHEET`.

Một AppScript tối đa được 20 triggers, do đó không làm theo cách: gắn 1 trigger vào mỗi mentor file, mỗi khi mentor file được cập nhật thì cập nhật file tổng hợp được (số lượng mentor file quá nhiều - trên 20).

---

## Cài đặt: tạo AppScript Project bằng `clasp` và git repo có sẵn

1. Enable Google Apps Script API: https://script.google.com/home/usersettings (có thao tác này thì `clasp` mới kết nối được với AppScript).

2. Cài đặt `clasp`

```shell copy
npm install -g @google/clasp
```

3. Login

```shell copy
clasp login
```

4. Clone project AppScript này về:

```shell copy
git clone https://github.com/uuuuv/funix-google-appscript-mentor.git
```

5. Di chuyển vào thư mục làm việc

```shell copy
cd funix-google-appscript-mentor
```

6. Tạo AppScript trên Cloud bằng `clasp`:

Ví dụ sẽ tạo tên AppScript là check-mentor

```shell copy
clasp create --title check-mentor --type standalone
```

7. Cập nhật các file

Sửa file `example.variable.js` thành `variable.js`.

Thay giá trị của `SUMMARY_SPREADSHEET_ID` và `MENTOR_FOLDER_ID` vào.

8. Push lên Cloud

```shell copy
clasp push
```

9. Kiểm tra xem AppScript đã được push chưa

Vào https://script.google.com/home, chọn tên project bạn đã tạo ở trên để kiểm tra.

---

> **_NOTE:_** khi chạy các function lần đầu sẽ được hỏi permission. Chấp nhận để chạy tiếp.

---

## Thêm time-driven trigger cho project (chức năng chính)

Sau khi vào https://script.google.com/home, chọn dự án mới được tạo, thực hiện các bước sau để thêm time-driven trigger:

1. Ở sidebar, chọn `Triggers` (hình đồng hồ)
2. Chọn `+ Add Trigger` ở góc phải dưới màn hình
3. Thiết lập các options:

- Choose which function to run: `updateSummaryFile`
- Choose which deployment should run: giữ nguyên `Head`
- Select event source: `Time-driven`
- Select type of time based trigger: tùy mong muốn của bạn
- Các tùy chọn sau tùy theo `Select type of time based trigger` mà khác nhau: tùy bạn

4. Click `Save`

Vậy đã thêm trigger chạy theo thời gian thành công. Mỗi khoảng thời gian bạn đã setup ở trên, function `updateSummaryFile` sẽ được trigger.

---

## Cập nhật lại file tổng hợp manually

Bạn có thể cập nhật file tổng hợp bằng tay bất cứ lúc nào bằng cách:

1. Click vào `< > Editor` ở sidebar.
2. Chọn `main.gs`
3. Chọn function cần chạy ở toolbar của editor (giữa `Debug` và `Execution log`) là `updateSummaryFile`
4. Click `Run` ở toolbar.

---

## Kiểm tra mentor spreadsheet có tên sheet không hợp lệ

Nhiều mentor spreadsheet có tên `Trang tính1`. Có thể kiểm tra bằng cách chạy `findInvalidMentorSheetNames` tương tự như trên. Xem log để xem kết quả.

---

## Sửa tên các sheet của các mentor spreadsheet có tên không hợp lệ

Function `fixMentorSheetNames` có tác dụng duyệt qua tất cả mentor file, kiểm tra các sheet. Nếu sheet không hợp lệ, sẽ đặt lại theo dạng `T9.2023`, `T10.2023`,... với tháng bắt đầu từ tháng 9.

Chạy function `fixMentorSheetNames` như cách trên để tiến hành sửa.

---

## Update mentor row trong sheet tổng hợp bằng checkbox

Để thực hiện chức năng: cột checkbox trong sheet tổng hợp, khi thay đổi checkbox (check hoặc bỏ check), `Tổng phiên đã review` và `Số phiên chưa đạt` của mentor đó sẽ được tính lại. Giá trị của cột `Xử lý trạng thái` sẽ hiện `Pending`, `Done` hoặc `Error`, làm như sau:

Chạy function `applySummaryTrigger` ở `main.gs`.

Để bỏ chức năng này, chạy `removeSummaryTrigger`.

> **_NOTE:_** hiện tại sheet tổng hợp chưa có `Error`. Thêm `Error` nếu muốn dùng chức năng này.

---

### Chú thích các file

- `main.js`: các function chính, có thể chạy bằng tay. `main.js` sẽ dùng các function, biến ở các file còn lại.
- `specific.js`: các function hỗ trợ cho function trong `main.gs`, không bao giờ chạy trực tiếp các function này bằng tay.
- `helper.js`: các function có thê copy để sử dụng ở project khác nếu cần.
- `trigger.js`: các function trigger, không bao giờ chạy bằng tay.
- `notUser.js`: các function không dùng đến.
- `example.variable.js`: chưa biến của project. Cần tên thành `variable.js` và cập nhật lại biến khi triển khai.
- `test.variable.js`: cấu trúc y hệt `example.variable.js`, chứa các biến để test. Xóa/comment code trong file khi triển khai.
- `.claspignore`: chứa các tên file sẽ không được upload lên AppScript Cloud.
