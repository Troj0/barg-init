<!--<script type="text/javascript">
        function sepetSil() {
            $(".sepetSil").click(function () {
                var id = $(this).data("id");
                var key = $(this).data("key");
                if (id > 0) {
                    var arr = {};
                    arr['method'] = 'deleteFromCart';
                    arr['id'] = id;
                    arr['key'] = key;

                    ajaxMethod(arr, function (e) {
                        if (e.status) {
                            if (e.detail.quantity == 0) {
                                location.reload();
                            }
                            $(".cartTotal").html(e.detail.quantity);
                            $(".getTotal").html(e.detail.getTotal);
                            $(".item[data-id='" + id + "']").remove();
                        }
                    });
                    basketAjaxNavbar();
                } else {
                    ChnKaAlert('', '/**no_text**sepet_silinirken_hata_olustu**/', "error", false, 2);
                }
            });

        }

        function basketAjaxNavbar() {
            var arr = {};
            arr['method'] = 'basketAjaxNavbar';
            ajaxMethod(arr, function (e) {
                if (e.detail.getTotal > 0) {
                    $('.basketSticky').removeClass('hide');
                } else {
                    $('.basketSticky').addClass('hide');
                }
                $('.dropdown-cart').find('.sepetNavbarAjax').html(e.data);
                sepetSil();
            });
        }

        basketAjaxNavbar();
        sepetSil();
    </script>-->
<!--<script type="text/javascript">
        $(".countdown").each(function () {
            var tz = $(this).attr('data-timezone');
            var end = $(this).attr('data-end');
            end = moment.tz(end, tz).toDate();
            $(this).countdown(end, function (event) {
                $(this).text(event.strftime('%D day %H:%M:%S'));
            });
        });

        $(window).scroll(function () {
            if ($(window).scrollTop() > 50) {
                $('.navbar-default').addClass("navbar-small");
            } else {
                $('.navbar-default').removeClass("navbar-small");
            }
        });

        function loadingFunction() {
            $('.page-preloader').delay(50).fadeOut(200);
        }

                cartOperation = false;

        function discountCouponAdd(inputID, reload) {
            if (!cartOperation) {
                cartOperation = true;
                var discount = $("#" + inputID).val();
                discount = $.trim(discount);
                if (discount != "") {
                    var arr = {};
                    arr['method'] = "addToDiscount";
                    arr['discount'] = discount;
                    ajaxMethod(arr, function (e) {
                        //indirim tutarı türü
                        let discountHtml = "";
                        $('.discountTotalText').html("");

                        if (e.status) {
                            $('.discountCouponDiv').removeClass("hide");
                            $('.discountCouponAddDIV').addClass("hide");
                            $('.discountCouponText').html(e.detail.code);
                            location.reload();
                        } else {
                            $('.discountCouponAddDIV').removeClass("hide");
                            $('.discountCouponDiv').addClass("hide");
                            $('.discountTotalText').html("");
                            alert(e.detail.message);
                            location.reload();
                        }
                        cartOperation = false;
                        $('.discountTotalText').html(discountHtml);

                        if (reload) {
                            location.reload();
                        }
                    });
                }
            }
            return false;
        }

        function discountCouponDelete(reload) {
            if (!cartOperation) {
                cartOperation = true;
                //loadingFunc(true);
                var arr = {};
                arr['method'] = "deleteDiscount";
                //$('.nextButton').attr('disabled', 'disabled');
                ajaxMethod(arr, function (e) {
                    //console.log("adding result:");
                    //console.log(e)
                    if (e.status) {
                        //writeCart(e);
                    }

                    cartOperation = false
                    if (reload) {
                        location.reload();
                    }
                });
            }
            return false;
        }

        $(document).ready(function () {
            $("#discountInput").keypress(function (e) {
                if (e.which == 13) {
                    $("#inputDiscount").trigger("click");
                    return false;
                }
            });

            $(".sepeteEkle").click(function () {
                var id = $(this).data("id");
                var number = $(".quantity[data-id='" + id + "']").val();
                if (id > 0 && number > 0) {
                    var arr = {};
                    arr['method'] = 'addToCart';
                    arr['id'] = id;
                    arr['number'] = number;

                    ajaxMethod(arr, function (e) {
                        if (e.status) {
                            $(".cartTotal").html(e.detail.quantity);
                            $(".getTotal").html(e.detail.getTotal);
                            ChnKaAlert_V2('', e.detail.message, "success", false, 1);
                        } else {
                            $(".cartTotal").html(e.detail.quantity);
                            $(".getTotal").html(e.detail.getTotal);
                            ChnKaAlert_V2('', e.detail.message, "error", false, 3);
                        }
                    });
                    basketAjaxNavbar();
                } else {
                    ChnKaAlert_V2('', 'An Error Occurred While Adding To Cart.', "error", false, 2);
                }
            });

            $(".sepetGuncelle").click(function () {
                var id = $(this).data("id");
                var key = $(this).data("key");
                var number = $(".quantity[data-id='" + id + "']").val();
                if (id > 0 && number > 0) {
                    var arr = {};
                    arr['method'] = 'updateToCart';
                    arr['id'] = id;
                    arr['key'] = key;
                    arr['number'] = number;

                    ajaxMethod(arr, function (e) {
                        if (e.status) {
                            $(".cartTotal").html(e.detail.quantity);
                            $(".getTotal").html(e.detail.getTotal);
                            ChnKaAlert('', e.detail.message, "success", false, 1);
                        } else {
                            $(".cartTotal").html(e.detail.quantity);
                            $(".getTotal").html(e.detail.getTotal);
                            ChnKaAlert_V2('', e.detail.message, "error", false, 3);
                        }
                        location.reload();
                    });
                    basketAjaxNavbar();
                } else {
                    ChnKaAlert('', 'An Error Occurred While Adding To Cart.', "error", false, 2);
                }
            });

            $(".sepetBosalt").click(function () {
                var arr = {};
                arr['method'] = 'truncateCart';
                ajaxMethod(arr, function (e) {
                    if (e.status) {
                        location.reload();
                    }
                });
                basketAjaxNavbar();
            });
        });
            </script>-->
<!--<script type="text/javascript">
        $('.navbar-toggle').click(function () {
            if ($('.navbar-chnka').hasClass('chnka-navbar-collapsed')) {
                $('.navbar-chnka').removeClass("chnka-navbar-collapsed");
            } else {
                $('.navbar-chnka').addClass("chnka-navbar-collapsed");
            }

            if ($('#navbar').hasClass('collapse')) {
                $('#navbar').removeClass("collapse");
            } else {
                $('#navbar').addClass("collapse");
            }

        });
        $(document).ready(function () {
            $('.ChnKaAlert_V2 .close').click(function () {
                $(this).parent('.ChnKaAlert_V2').remove()
            });
        });
    </script>-->
<!--<script type="text/javascript" charset="utf-8">
        function setCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            } else
                var expires = "";
            document.cookie = name + "=" + value + expires;
        }

        function getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0)
                    return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        var cerezDeger = getCookie("cerez");
        if (cerezDeger == null) {
            $(".cerezNotification").show(500);
            $("#cerezNotificationHide").click(function () {
                $(".cerezNotification").hide(500);
                setCookie("cerez", "deger", 1);
            });

        }
        loadingFunction()
    </script>-->
