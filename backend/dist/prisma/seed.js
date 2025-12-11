"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Iniciando seed...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ecommerce.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@ecommerce.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin criado:', admin.email);
    const products = [
        {
            name: 'iPhone 15 Pro Max',
            price: 7999.90,
            oldPrice: 8999.90,
            stock: 15,
            category: 'Smartphones',
            sku: 'APL-IP15PM',
            image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
            description: 'O smartphone mais avançado da Apple com chip A17 Pro',
            rating: 4.8,
            reviews: 234,
            featured: true,
        },
        {
            name: 'MacBook Pro M3 14"',
            price: 12999.90,
            oldPrice: 14999.90,
            stock: 8,
            category: 'Notebooks',
            sku: 'APL-MBP14',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            description: 'Desempenho profissional com chip M3',
            rating: 4.9,
            reviews: 189,
            featured: true,
        },
        {
            name: 'AirPods Pro 2',
            price: 1899.90,
            oldPrice: 2199.90,
            stock: 45,
            category: 'Áudio',
            sku: 'APL-APP2',
            image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
            description: 'Cancelamento de ruído adaptativo',
            rating: 4.7,
            reviews: 456,
            featured: false,
        },
    ];
    for (const product of products) {
        await prisma.product.upsert({
            where: { sku: product.sku },
            update: {},
            create: product,
        });
    }
    console.log(`✅ ${products.length} produtos criados`);
    console.log('\n🎉 Seed concluído com sucesso!');
}
main()
    .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map