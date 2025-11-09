# PayPal Subscription Setup Guide

## Overview
This guide will help you set up PayPal subscriptions for your Kid-tionary application.

## Prerequisites
- A PayPal Business account
- Admin access to your Kid-tionary application

## Step 1: Create PayPal Subscription Plans

1. **Log in to PayPal Business**
   - Go to [PayPal Business](https://www.paypal.com/businessmanage/account/subscriptions)
   - Sign in with your business account credentials

2. **Navigate to Subscriptions**
   - Click on "Products & Services" in the left sidebar
   - Select "Subscriptions"

3. **Create Student Plan**
   - Click "Create Plan"
   - Plan Name: `Student Monthly`
   - Billing Cycle: Monthly
   - Price: $4.99 USD
   - Click "Save"
   - **Copy the Plan ID** (starts with "P-") - you'll need this!

4. **Create Classroom Plan**
   - Click "Create Plan" again
   - Plan Name: `Classroom Monthly`
   - Billing Cycle: Monthly
   - Price: $29.99 USD
   - Click "Save"
   - **Copy the Plan ID** (starts with "P-") - you'll need this!

## Step 2: Configure Plans in Admin Panel

1. **Access Admin Panel**
   - Log in to your Kid-tionary application
   - Navigate to `/admin` (admin login required)

2. **Go to PayPal Settings**
   - Click "PayPal Settings" in the left sidebar
   - You'll see three plan configurations

3. **Update Student Plan**
   - Find the "Student Plan" card
   - Paste your PayPal Student Plan ID (from Step 1.3)
   - Verify the price matches ($4.99)
   - Update features if needed (one per line)
   - Click "Save Changes"

4. **Update Classroom Plan**
   - Find the "Classroom Plan" card
   - Paste your PayPal Classroom Plan ID (from Step 1.4)
   - Verify the price matches ($29.99)
   - Update features if needed (one per line)
   - Click "Save Changes"

5. **Free Plan**
   - No PayPal Plan ID needed
   - You can update features and pricing display only

## Step 3: Test the Integration

1. **Visit Subscription Page**
   - Go to `/subscription` on your site
   - Verify all three plans display correctly
   - Check that prices and features match your configuration

2. **Test a Subscription (Sandbox Mode)**
   - Click "Subscribe Now" on Student or Classroom plan
   - You should be redirected to PayPal
   - Complete the test subscription with sandbox credentials

3. **Verify in PayPal Dashboard**
   - Return to PayPal Business dashboard
   - Check that the subscription appears in your transactions

## Troubleshooting

### Plans Not Displaying
- Check that plans are marked as "Active" in PayPal
- Verify Plan IDs are correct (start with "P-")
- Check browser console for errors

### Subscription Fails
- Ensure PayPal API credentials are set in Supabase edge function environment
- Verify Plan IDs match exactly between PayPal and your database
- Check that billing cycle is set to "MONTH" in PayPal

### Price Mismatch
- Update prices in both PayPal dashboard AND admin panel
- Prices must match for subscriptions to work correctly

## Updating Prices

To change subscription prices:

1. **In PayPal**: Create a new plan with the new price (you cannot edit existing plan prices)
2. **In Admin Panel**: Update the Plan ID and price to match the new plan
3. **Existing Subscribers**: Will continue at their original price until they resubscribe

## Support

For issues with:
- **PayPal setup**: Contact PayPal Business Support
- **Admin panel**: Check application logs
- **Integration**: Review edge function logs in Supabase dashboard
