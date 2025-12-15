-- CreateTable
CREATE TABLE "CompanySubCategory" (
    "companyId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "CompanySubCategory_pkey" PRIMARY KEY ("companyId","subCategoryId")
);

-- AddForeignKey
ALTER TABLE "CompanySubCategory" ADD CONSTRAINT "CompanySubCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySubCategory" ADD CONSTRAINT "CompanySubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
