-- Configure the ESP as a station (client)
wifi.setmode(wifi.STATION)  
wifi.sta.config("", "")  
wifi.sta.autoconnect(1)

-- Print IP address
ip = wifi.sta.getip()  
print(ip)

-- Create a CoAP client
cc = coap.Client()

-- Make a POST request
uri="coap://192.168.1.100:8000/object/5550937980d51931b3000009/send"

tmr.alarm(0, 3000, 1, function() 
    buf = 
          "{" ..
          "\"temperature\":" ..
          adc.read(0) ..
          "}"
    
    cc:post(uri, buf)
    print(buf)
end)
