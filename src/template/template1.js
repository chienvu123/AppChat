const template = `<body>
<div
  style="width: 100%; display: flex;align-items: center; flex-direction: column"
>
  <h2 style="margin: 0">Trường Đại học Bách Khoa Hà Nội</h2>
  <h3 style="margin: 0">Viện Công nghệ thông tin và Truyền thông</h3>
  <h2 style="margin-top: 30px">Biểu mẫu 1</h2>
  <style>
    #table1 td,
    th {
      border: 1px solid grey;
      align-items: center;
      text-align: center;
    }
    .time {
      width: 15%;
    }
    .name {
      text-align: left !important;
      padding: 5px 0 5px 10px;
      width: 25%;
    }
    .content {
      text-align: left !important;
      padding: 5px 0 5px 10px;
      width: 60%
    }
    #table1 {
      border-spacing: 0;
      border: 0px;
    }
  </style>
  <table style="width: 60%; border: 1px solid grey" id="table1">
    
`;

export default template;
