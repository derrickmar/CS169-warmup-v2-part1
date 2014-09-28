"""
Each file that starts with test... in this directory is scanned for subclasses of unittest.TestCase or testLib.RestTestCase
"""

import unittest
import os
import testLib

class TestLoginUser(testLib.RestTestCase):

    # methods==========================
    """Test adding users"""
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)

    def assertLogin(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS, password = "password", user = "user1"):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode, 'password': password, 'user': user }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)


    # tests======================================
    def testLogin1(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        # print respData
        self.assertResponse(respData, count = 1)
        respLoginData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        # print respLoginData
        self.assertLogin(respLoginData, count = 2)

    def testLogin2(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        # print respData
        self.assertResponse(respData, count = 1)
        respLoginData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        # print respLoginData
        self.assertLogin(respLoginData, count = 2)

    def testLogin3(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        # print respData
        self.assertResponse(respData, count = 1)
        respLoginData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'wrong_password'} )
        # print respLoginData
        self.assertResponse(respLoginData, count = None,  errCode = -1)

    def testAdd1(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : '', 'password' : 'password'} )
        # print respData
        self.assertResponse(respData, count = None, errCode = -3)

    def testAdd2(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        # print respData
        duplicateUserData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(duplicateUserData, count = None, errCode = -2)

    def testAdd3(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        # print respData
        duplicateUserData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarf', 'password' : 'password'} )
        self.assertResponse(duplicateUserData, count = None, errCode = -3)
