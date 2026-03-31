-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "polarSubscriptionId" TEXT NOT NULL,
    "polarCustomerId" TEXT NOT NULL,
    "polarProductId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_polarSubscriptionId_key" ON "Subscription"("polarSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_polarCustomerId_key" ON "Subscription"("polarCustomerId");

-- CreateIndex
CREATE INDEX "Subscription_polarSubscriptionId_idx" ON "Subscription"("polarSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_polarCustomerId_idx" ON "Subscription"("polarCustomerId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
