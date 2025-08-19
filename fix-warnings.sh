#!/bin/bash

echo "🔧 Fixing ESLint warnings..."

# Fix admin/orders page
sed -i '/FunnelIcon,/d' app/\(private\)/admin/orders/page.js
sed -i '/CalendarIcon,/d' app/\(private\)/admin/orders/page.js  
sed -i '/PencilIcon,/d' app/\(private\)/admin/orders/page.js
sed -i 's/const updateMultipleOrders/\/\/ const updateMultipleOrders/' app/\(private\)/admin/orders/page.js
sed -i 's/const StatusIcon/\/\/ const StatusIcon/' app/\(private\)/admin/orders/page.js

# Fix admin components
sed -i '/useEffect/d' app/admin/components/DashboardStats.js
sed -i 's/\[stats, setStats\]/\[stats\]/' app/admin/components/DashboardStats.js
sed -i 's/\[recentOrders, setRecentOrders\]/\[recentOrders\]/' app/admin/components/DashboardStats.js

# Fix error variables
sed -i 's/} catch (error) {/} catch (err) {/' app/admin/components/GalleryManager.js
sed -i 's/} catch (error) {/} catch (err) {/' app/admin/components/MaterialsManager.js
sed -i 's/} catch (error) {/} catch (err) {/' app/admin/components/OrdersManager.js
sed -i 's/} catch (error) {/} catch (err) {/' app/admin/components/ProductsManager.js

# Fix login page
sed -i 's/} catch (err) {/} catch (e) {/' app/login/page.js

# Fix stickers checkout
sed -i '/ExclamationTriangleIcon,/d' app/stickers/checkout/page.js
sed -i '/SparklesIcon,/d' app/stickers/checkout/page.js
sed -i '/const stripePromise/d' app/stickers/checkout/page.js

# Fix stickers gallery
sed -i '/getSEOTags/d' app/stickers/gallery/page.js
sed -i '/FunnelIcon,/d' app/stickers/gallery/page.js
sed -i '/EyeIcon,/d' app/stickers/gallery/page.js
sed -i '/PencilIcon,/d' app/stickers/gallery/page.js
sed -i '/ArrowDownTrayIcon,/d' app/stickers/gallery/page.js

# Fix stickers materials
sed -i '/AnimatePresence/d' app/stickers/materials/page.js
sed -i '/InformationCircleIcon,/d' app/stickers/materials/page.js
sed -i '/ShieldCheckIcon,/d' app/stickers/materials/page.js
sed -i '/BeakerIcon,/d' app/stickers/materials/page.js

# Fix stickers success/tracking
sed -i '/ArrowRightIcon,/d' app/stickers/success/page.js
sed -i '/ArrowRightIcon,/d' app/stickers/tracking/page.js

# Fix ButtonSignin
sed -i '/^import Link/d' components/ButtonSignin.js

# Fix UserForm
sed -i '/^import Link/d' components/admin/users/UserForm.js

# Fix DesignPreview
sed -i '/, useEffect/d' components/stickers/DesignPreview.js
sed -i '/^import Image/d' components/stickers/DesignPreview.js

# Fix FileUploader
sed -i '/^import Image/d' components/stickers/FileUploader.js

# Fix MaterialSelector
sed -i '/^import Image/d' components/stickers/MaterialSelector.js

echo "✅ Fixed import warnings"
