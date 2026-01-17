# BIMI Setup Guide for betadomot.blog

## Current Configuration
- Domain: `betadomot.blog`
- From Email: `hello@betadomot.blog`
- Email Provider: Resend

## BIMI Requirements Checklist

### 1. Verify DMARC Policy (CRITICAL)
BIMI requires DMARC policy to be `quarantine` or `reject`, NOT `none`.

**Check your current DMARC record:**
```bash
nslookup -type=TXT _dmarc.betadomot.blog
```

**Required DMARC record format:**
```
_dmarc.betadomot.blog TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@betadomot.blog; pct=100; adkim=s; aspf=s"
```

Or stricter:
```
_dmarc.betadomot.blog TXT "v=DMARC1; p=reject; rua=mailto:dmarc@betadomot.blog; pct=100; adkim=s; aspf=s"
```

**If your DMARC is set to `p=none`, BIMI will NOT work!**

### 2. Verify SPF Record
**Check your SPF record:**
```bash
nslookup -type=TXT betadomot.blog
```

**Required SPF record for Resend:**
```
betadomot.blog TXT "v=spf1 include:_spf.resend.com ~all"
```

### 3. Verify DKIM is Enabled in Resend
1. Log into your Resend dashboard: https://resend.com/domains
2. Go to your domain `betadomot.blog`
3. Ensure DKIM is verified (green checkmark)
4. Resend should show you the DKIM records to add to your DNS

**Typical DKIM record format:**
```
resend._domainkey.betadomot.blog TXT "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE"
```

### 4. Create BIMI DNS Record
**Add this TXT record to your DNS:**
```
default._bimi.betadomot.blog TXT "v=BIMI1; l=https://betadomot.blog/bimi-logo.svg"
```

**Important:** The logo URL must:
- Be publicly accessible via HTTPS
- Be in SVG Tiny P/S format (not regular SVG)
- Be square (1:1 aspect ratio)
- Be hosted on your domain or a CDN

### 5. Prepare Your BIMI Logo

Your logo must be in **SVG Tiny P/S** format. Regular SVG won't work!

**Convert your logo:**
1. Use an online converter: https://www.iloveimg.com/convert-to-svg
2. Or use this tool specifically for BIMI: https://bimigroup.org/bimi-generator/

**Logo requirements:**
- Format: SVG Tiny P/S (Portable/Secure)
- Size: Square (1:1 ratio), recommended 512x512px
- File size: Under 32KB
- No external references
- No JavaScript
- No animations

**Save the logo as:** `frontend/public/bimi-logo.svg`

### 6. Test Your BIMI Setup

**Online BIMI validators:**
1. https://bimigroup.org/bimi-generator/ - BIMI Group official validator
2. https://www.mailhardener.com/tools/bimi-inspector - Check BIMI record
3. https://mxtoolbox.com/SuperTool.aspx - Check DNS records

**Command line check:**
```bash
# Check BIMI record
nslookup -type=TXT default._bimi.betadomot.blog

# Check DMARC
nslookup -type=TXT _dmarc.betadomot.blog

# Check SPF
nslookup -type=TXT betadomot.blog

# Check DKIM (replace 'resend' with your selector)
nslookup -type=TXT resend._domainkey.betadomot.blog
```

## Common Issues & Solutions

### Issue 1: BIMI logo not showing
**Causes:**
- DMARC policy is set to `p=none` (must be `quarantine` or `reject`)
- Logo is not in SVG Tiny P/S format
- Logo URL is not accessible
- DNS records not propagated yet (can take 24-48 hours)

**Solution:**
1. Update DMARC to `p=quarantine` or `p=reject`
2. Convert logo to SVG Tiny P/S format
3. Wait 24-48 hours for DNS propagation
4. Test with Gmail (BIMI support is best there)

### Issue 2: Email providers don't support BIMI yet
**Current BIMI support:**
- ✅ Gmail (full support)
- ✅ Yahoo Mail (full support)
- ✅ Fastmail (full support)
- ❌ Outlook/Hotmail (limited/no support)
- ❌ Apple Mail (no support yet)

### Issue 3: Logo shows for some recipients but not others
This is normal! BIMI adoption takes time:
- Gmail may cache results for 24-48 hours
- Different email providers have different BIMI support levels
- Some providers require VMC (Verified Mark Certificate)

## VMC (Verified Mark Certificate) - Optional

For faster and more reliable BIMI adoption, consider getting a VMC:
- Cost: $1,500-$2,000 per year
- Providers: DigiCert, Entrust
- Benefits: Faster logo display, more email provider support

**For most small businesses, VMC is optional. Focus on getting the basics right first!**

## Step-by-Step Action Plan

1. **Check your current DMARC policy** (most likely the issue)
   ```bash
   nslookup -type=TXT _dmarc.betadomot.blog
   ```

2. **If DMARC is `p=none`, update it to `p=quarantine`**
   - Log into your DNS provider (where you manage betadomot.blog)
   - Update the `_dmarc.betadomot.blog` TXT record

3. **Verify Resend DKIM is working**
   - Check Resend dashboard
   - Ensure all DNS records are verified

4. **Create your BIMI logo in SVG Tiny P/S format**
   - Use the BIMI generator tool
   - Save to `frontend/public/bimi-logo.svg`

5. **Add BIMI DNS record**
   ```
   default._bimi.betadomot.blog TXT "v=BIMI1; l=https://betadomot.blog/bimi-logo.svg"
   ```

6. **Wait 24-48 hours for DNS propagation**

7. **Test by sending an email to your Gmail account**

## Need Help?

If you're still having issues after following this guide:
1. Share the output of the DNS checks above
2. Confirm your DMARC policy setting
3. Verify your logo is in the correct format
4. Test with Gmail first (best BIMI support)

## Resources
- BIMI Group: https://bimigroup.org/
- BIMI Generator: https://bimigroup.org/bimi-generator/
- Resend Docs: https://resend.com/docs
- DMARC Guide: https://dmarc.org/
