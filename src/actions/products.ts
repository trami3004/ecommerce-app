"use server"

// Lưu ý: Bỏ dấu { } quanh prisma vì bạn dùng export default ở bước trước
import prisma from "@/lib/prisma" 
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Định nghĩa khung kiểm tra dữ liệu (Validation) 
const ProductSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().cuid(),
})

export async function createProduct(formData: FormData) {
  // 1. Lấy dữ liệu từ Form và kiểm tra tính hợp lệ [cite: 172, 173]
  const result = ProductSchema.safeParse(Object.fromEntries(formData))
  
  // 2. Nếu dữ liệu sai (ví dụ giá âm), trả về lỗi để hiển thị lên màn hình [cite: 174, 175]
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // 3. Nếu dữ liệu đúng, lưu vào Database Neon [cite: 176]
  await prisma.product.create({ 
    data: result.data 
  })

  // 4. Xóa bộ nhớ đệm (cache) để trang web cập nhật sản phẩm mới ngay lập tức [cite: 177, 178, 179]
  revalidatePath("/products") 
  revalidatePath("/admin/products") 
  
  // 5. Quay về trang danh sách quản lý [cite: 178]
  redirect("/admin/products")
}