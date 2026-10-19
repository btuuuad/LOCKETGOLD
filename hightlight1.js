// ========= ID MAPPING ========= //
const mapping = {
    'Locket': ['Gold', 'locket_1600_1y'],
    '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip']
};

// ========= KHỞI TẠO AN TOÀN ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
var obj = {};
try {
    obj = JSON.parse($response.body);
} catch (e) {
    $done({});
}

// 1. NẾU LÀ REVENUECAT (XÁC THỰC GÓI MUA HÀNG & HUY HIỆU PROFILE)
if (obj.subscriber) {
    obj.Attention = "Chúc mừng bạn! Đã kích hoạt Locket Gold VIP & Gold Badge vĩnh viễn!";
    obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
    obj.subscriber.entitlements = obj.subscriber.entitlements || {};
    obj.subscriber.non_subscriptions = obj.subscriber.non_subscriptions || {};
    obj.subscriber.other_purchases = obj.subscriber.other_purchases || {};

    var btuuuad = {
        auto_resume_date: null,
        display_name: "Locket Gold Yearly VIP",
        is_sandbox: false,
        ownership_type: "PURCHASED",
        billing_issues_detected_at: null,
        management_url: "https://apps.apple.com/account/subscriptions",
        period_type: "normal",
        price: {
            amount: 399000.0,
            currency: "VND"
        },
        expires_date: "2099-12-31T23:59:59Z",
        grace_period_expires_date: null,
        refunded_at: null,
        unsubscribe_detected_at: null,
        original_purchase_date: "2022-01-01T00:00:00Z",
        purchase_date: "2022-01-01T00:00:00Z",
        store: "app_store",
        store_transaction_id: "2000001108724193"
    };

    var locketGold = {
        grace_period_expires_date: null,
        purchase_date: "2022-01-01T00:00:00Z",
        product_identifier: "locket_1600_1y",
        expires_date: "2099-12-31T23:59:59Z"
    };

    const match = Object.keys(mapping).find(e => ua.includes(e));
    if (match) {
        let [entitlementKey, productKey] = mapping[match];
        let pid = productKey || "locket_1600_1y";
        locketGold.product_identifier = pid;
        
        obj.subscriber.subscriptions[pid] = btuuuad;
        obj.subscriber.subscriptions["locket_199_1m"] = btuuuad;
        obj.subscriber.subscriptions["locket_gold_yearly"] = btuuuad;

        obj.subscriber.entitlements[entitlementKey] = locketGold;
        obj.subscriber.entitlements["pro"] = locketGold;
        obj.subscriber.entitlements["vip"] = locketGold;
        obj.subscriber.entitlements["gold"] = locketGold;
    } else {
        obj.subscriber.subscriptions["locket_1600_1y"] = btuuuad;
        obj.subscriber.entitlements.pro = locketGold;
        obj.subscriber.entitlements.Gold = locketGold;
    }

    // Gắn thông tin đặc quyền Gold Badge & Huy hiệu độc quyền vào thuộc tính tài khoản
    obj.subscriber.subscriber_attributes = Object.assign(obj.subscriber.subscriber_attributes || {}, {
        "$locket_gold_status": { value: "active_vip", updated_at_ms: Date.now() },
        "$tier": { value: "gold_lifetime", updated_at_ms: Date.now() },
        "$profile_badge": { value: "gold_badge", updated_at_ms: Date.now() },
        "$badge_type": { value: "locket_gold", updated_at_ms: Date.now() },
        "$early_adopter": { value: "true", updated_at_ms: Date.now() }
    });
} 

// 2. NẾU LÀ FIREBASE REMOTE CONFIG (CẤU HÌNH GIAO DIỆN, HUY HIỆU PROFILE & AI CAPTION)
else if (ua.includes("Locket")) {
    obj.Attention = "Chúc mừng bạn! Đã lên Locket Premium Gold Badge Ultimate!";
    obj.entries = obj.entries || {};

    Object.assign(obj.entries, {
        feature_gates: JSON.stringify({
            app_icon_picker: "enabled",
            camera_roll: "enabled",
            camera_theme: "enabled",
            camera_filters: "enabled",
            friend_locket_count: "enabled",
            locket_views: "enabled",
            long_captions: "enabled",
            longer_video: "enabled",
            unlimited_friends: "enabled",
            priority_support: "enabled",
            profile_badge: "enabled",
            gold_badge: "enabled",
            remove_ads: "enabled",
            video: "enabled",
            custom_widget_frames: "enabled",
            streak_recovery: "enabled"
        }),
        upsell_features: JSON.stringify({
            app_icon_picker: true,
            camera_roll: true,
            camera_theme: true,
            camera_filters: true,
            friend_locket_count: true,
            locket_views: true,
            remove_ads: true,
            custom_widget_frames: true
        }),
        paywall_presentation_config: JSON.stringify({
            uid: "paywall_testflight",
            onboarding: false,
            after_sent_moment: false,
            on_foreground: false,
            interval: 2592000,
            profile_banner: true
        }),
        feature_discovery_popup_config: JSON.stringify({
            tag: "LOCKET GOLD BADGE",
            tag_gradient: true,
            tag_style: "gold_gradient",
            title: "Đã kích hoạt Huy hiệu Gold cực cháy 😎",
            feature_set: [
                {
                    title: "Locket Gold Badge sẵn sàng ✨",
                    body: "Huy hiệu vàng • Profile VIP lấp lánh 💛",
                    imageURL: "https://i.ibb.co/9LRn7VY/DORAEMON.jpg"
                }
            ],
            primary_button_title: "Xong",
            campaign: "locket_gold_welcome_v3",
            start_at: "2020-01-01T00:00:00",
            end_at: "2099-12-31T23:59:59",
            use_local_time_zone: true
        }),
        android_subscribe_gold_button_enabled: "false",
        profile_badge_visible: "true",
        profile_badge_type: "gold",
        gold_badge_enabled: "true",
        user_profile_badge: "gold_gradient",
        lunar_new_year_app_icon_enabled: "true",
        custom_app_icons_enabled: "true",
        unlocked_app_icons: JSON.stringify([
            "gold", "retro", "neon", "pride", "lunar_new_year",
            "valentine", "halloween", "cyber", "dark", "pastel"
        ])
    });

    // Cờ chặn quảng cáo & tracking
    Object.assign(obj.entries, {
        history_ads_mode: "off",
        history_ads_prefetch_count: "0",
        sentry_sample_rate: "0",
        sentry_network_tracing: "false",
        sentry_performance_tracking: "false"
    });

    // Cờ Camera 60FPS, HDR & Filter
    Object.assign(obj.entries, {
        ai_face_detection_enabled: "true",
        ai_smile_capture_enabled: "true",
        smart_framing_enabled: "true",
        scene_recognition_enabled: "true",
        filters_enabled: "true",
        camera_filters_enabled: "true",
        ar_filters_enabled: "true",
        camera: JSON.stringify({
            gold_max_duration: 60.0,
            max_duration: 60.0,
            hdr: true,
            frame_rate: 60,
            fps: 60,
            quality_mbps: 10.0
        }),
        camera_roll: JSON.stringify({
            gold_max_duration: 60.0,
            max_duration: 60.0,
            frame_rate: 60,
            fps: 60,
            quality_mbps: 10.0
        })
    });

    // Cờ Rank bạn bè & Tự động lưu ảnh
    Object.assign(obj.entries, {
        friend_locket_count_enabled: "true",
        friends_sheet_locket_count_enabled: "true",
        show_friend_locket_count: "true",
        locket_count_badge_enabled: "true",
        auto_save_moments_enabled: "true",
        auto_save_to_camera_roll: "true",
        unsend_message_enabled: "true",
        typing_indicators_enabled: "true",
        reply_prototype_enabled: "true"
    });

    // Danh sách Caption thông minh
    var now = new Date();
    var hours = now.getHours();
    var minutes = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
    var hourStr = (hours < 10 ? "0" : "") + hours;

    var dayPercent = Math.floor(((hours * 60 + now.getMinutes()) / 1440) * 100);
    var filledBlocks = Math.floor(dayPercent / 10);
    var progressBar = "█".repeat(filledBlocks) + "▒".repeat(10 - filledBlocks);

    var aiAutoPick = hours >= 18 ? "Lên đồ xuống phố, xả hết mệt mỏi 🌃" : "Gửi chút nắng sớm cho ngày mới rực rỡ ☀️";

    Object.assign(obj.entries, {
        overlay_navigator_enabled: "true",
        captions_enabled: "true",
        overlay_items: JSON.stringify([
            {
                section: "👑 Locket Gold Badge & AI ✨",
                items: [
                    {
                        overlay_id: "caption:gold_badge_status",
                        source: "remote",
                        caption: {
                            background: { colors: ["#BF953F", "#FCF6BA", "#B38728"], material_blur: "ultra_thin" },
                            icon: { type: "sf_symbol", data: "checkmark.seal.fill", color: "#FFFFFF" },
                            max_lines: 1,
                            text: "Locket Gold • Verified Member 🌟",
                            text_color: "#1C1C1E",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ai_auto_context",
                        source: "remote",
                        caption: {
                            background: { colors: ["#0F2027", "#203A43"], material_blur: "ultra_thin" },
                            icon: { type: "sf_symbol", data: "wand.and.stars", color: "#00F2FE" },
                            max_lines: 2,
                            text: aiAutoPick,
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    }
                ]
            }
        ])
    });
}

$done({
    body: JSON.stringify(obj)
});
