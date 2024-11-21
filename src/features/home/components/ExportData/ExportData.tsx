// import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';
// import logo from '../../../../../assets/images/logo_transprent.png'

// const ExportData = () => {

//   const styles = StyleSheet.create({
//     page: { padding: 30, fontSize: 12 },
//     header: { textAlign: 'center', marginBottom: 20 },
//     title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
//     section: { marginBottom: 10 },
//     // table: { display: 'table', width: '100%', marginVertical: 10 },
//     row: { flexDirection: 'row' },
//     cell: { borderWidth: 1, padding: 5, flex: 1, textAlign: 'center' },
//     signature: { textAlign: 'center', marginTop: 20 },
//     logo:{width:80}
//   });

//   const TeamName = () => (
//     <View style={styles.header}>
//       <Image src={logo} style={styles.logo} />
//       {/* <Text style={styles.textTeamName}>Graduation Shop</Text> */}
//     </View>
//   )

//   return (
//     <Document>
//       <Page style={styles.page}>
//         {/* Header */}
//         <TeamName />
//         <View style={styles.header}>
//           <Text>Số: ........</Text>
//           <Text>...., ngày...tháng...năm...</Text>
//         </View>

//         {/* Title */}
//         <Text style={styles.title}>BÁO CÁO DOANH THU</Text>

//         {/* Gửi đến */}
//         <View style={styles.section}>
//           <Text>Kính gửi: – Trưởng phòng ……………………………</Text>
//           <Text>– Giám đốc Công ty ……………………...</Text>
//         </View>

//         {/* Thông tin người lập */}
//         <View style={styles.section}>
//           <Text>Tôi tên là: …………………………………………. Sinh ngày: ………………………</Text>
//           <Text>Chức vụ: ………………………………… Bộ phận: ………………………………….</Text>
//           <Text>Hôm nay, ngày……tháng……năm….. tôi lập báo cáo bán hàng của chi nhánh …………. như sau:</Text>
//         </View>

//         {/* Báo cáo tổng quát */}
//         <View style={styles.section}>
//           <Text>1. Báo cáo tổng quát:</Text>
//           <Text>- Tổng đơn bán: ……….</Text>
//           <Text>- Doanh thu trước chiết khấu: ……….</Text>
//           <Text>- Doanh thu sau chiết khấu: ……….</Text>
//           <Text>- Lợi nhuận: ……….</Text>
//         </View>

//         {/* Hoạt động bán lẻ */}
//         <View style={styles.section}>
//           <Text>2. Hoạt động bán lẻ</Text>
//           {/* <View style={styles.table}> */}
//             <View style={styles.row}>
//               <Text style={styles.cell}>STT</Text>
//               <Text style={styles.cell}>Tên khách hàng</Text>
//               <Text style={styles.cell}>SĐT</Text>
//               <Text style={styles.cell}>Sản phẩm mua</Text>
//               <Text style={styles.cell}>Chiết khấu</Text>
//               <Text style={styles.cell}>Tổng hóa đơn</Text>
//               <Text style={styles.cell}>Người lập</Text>
//             </View>
//             {/* Thêm các hàng dữ liệu ở đây */}
//             <View style={styles.row}>
//               <Text style={styles.cell}>1</Text>
//               <Text style={styles.cell}>...</Text>
//               <Text style={styles.cell}>...</Text>
//               <Text style={styles.cell}>...</Text>
//               <Text style={styles.cell}>...</Text>
//               <Text style={styles.cell}>...</Text>
//               <Text style={styles.cell}>...</Text>
//             </View>
//           </View>
//           <Text>Tổng cộng: ………….</Text>
//         </View>

//         {/* Nhận xét */}
//         <View style={styles.section}>
//           <Text>3. Nhận xét – đánh giá</Text>
//           <Text>………………………………………………………………………………..….</Text>
//         </View>

//         {/* Đề xuất, kiến nghị */}
//         <View style={styles.section}>
//           <Text>4. Đề xuất, kiến nghị</Text>
//           <Text>………………………………………………………………………………….…….</Text>
//         </View>

//         {/* Chữ ký */}
//         <View style={styles.signature}>
//           <Text>CỬA HÀNG TRƯỞNG (Ký và ghi rõ họ tên)</Text>
//           <Text>NGƯỜI LẬP BÁO CÁO (Ký và ghi rõ họ tên)</Text>
//         </View>
//       </Page>
//     </Document>

//   )
// }

// export default ExportData


const ExportData = () => {
  return (
    <div>ExportData</div>
  )
}

export default ExportData