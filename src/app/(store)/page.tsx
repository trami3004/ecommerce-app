import prisma from "@/lib/prisma"; // [cite: 121, 123]

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  // Trong Next.js 14/15, nên await searchParams để tránh cảnh báo
  const { category, minPrice, maxPrice, q, sort } = await searchParams; // 

  const products = await prisma.product.findMany({ // [cite: 134]
    where: {
      AND: [ // [cite: 135]
        category ? { category: { slug: category } } : {}, // [cite: 139]
        minPrice ? { price: { gte: Number(minPrice) } } : {}, // [cite: 140]
        maxPrice ? { price: { lte: Number(maxPrice) } } : {}, // [cite: 140]
        q ? { 
          OR: [
            { name: { contains: q, mode: "insensitive" } }, // 
            // { description: { contains: q, mode: "insensitive" } } // Chỉ mở dòng này nếu model Product có description
          ]
        } : {},
      ]
    },
    include: { category: true }, // [cite: 148]
    orderBy: sort === "price-asc" ? { price: "asc" } // [cite: 149]
      : sort === "newest" ? { createdAt: "desc" } // [cite: 150]
      : { featured: "desc" } // [cite: 150]
  });

  return (
    <div className="container mx-auto px-4 py-8"> {/* [cite: 152] */}
      <div className="flex gap-8"> {/* [cite: 153] */}
        {/* Chỗ này sau này sẽ thêm <ProductFilters /> như file [cite: 154] */}
        
        <div className="grid grid-cols-3 gap-6"> {/* [cite: 155] */}
          {products.map((p) => (
             <div key={p.id} className="border p-4 rounded shadow">
                <h2 className="font-bold">{p.name}</h2>
                <p>{Number(p.price).toLocaleString()}đ</p>
             </div>
          ))} {/* [cite: 156] */}
        </div>
      </div>
    </div>
  );
}